import pool from "../db.js";
import AppError from "../utils/AppError.js";
import type { WorkoutSetInput, WorkoutSetResponse } from "../types/workout.js";

interface SyncWorkoutExerciseSetsParams {
    workoutId: string;
    workoutExerciseId: string;
    userId: string;
    sets: WorkoutSetInput[];
}

interface ExistingSetRow {
    id: string;
    set_number: number;
    reps: number;
    weight: string | null;
}

interface UpdatedWorkoutExerciseSets {
    workoutExerciseId: string;
    sets: WorkoutSetResponse[];
}

interface DeleteWorkoutExercisesParams {
    workoutId: string;
    userId: string;
    workoutExerciseIds: string[];
}

interface WorkoutExerciseStats {
    total_exercises: number;
    max_position: number;
}

const syncWorkoutExerciseSets = async ({
    workoutId,
    workoutExerciseId,
    userId,
    sets,
}: SyncWorkoutExerciseSetsParams): Promise<UpdatedWorkoutExerciseSets> => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Verify workout ownership and lock the parent row.
        const workoutResult = await client.query(
            `
                SELECT id
                FROM workouts
                WHERE id = $1 AND user_id = $2
                FOR UPDATE
            `,
            [workoutId, userId],
        );

        if (workoutResult.rows.length === 0) {
            throw new AppError("Workout not found", 404);
        }

        // 2. Verify that the exercise association belongs to this workout.
        const exerciseResult = await client.query(
            `
                SELECT id
                FROM workout_exercises
                WHERE id = $1 AND workout_id = $2
                FOR UPDATE
            `,
            [workoutExerciseId, workoutId],
        );

        if (exerciseResult.rows.length === 0) {
            throw new AppError("Workout exercise not found", 404);
        }

        // 3. Fetch and lock the current sets.
        const existingResult = await client.query<ExistingSetRow>(
            `
                SELECT id, set_number, reps, weight
                FROM workout_sets
                WHERE workout_exercise_id = $1
                FOR UPDATE
            `,
            [workoutExerciseId],
        );

        const existingSets = existingResult.rows;
        const existingSetMap = new Map(
            existingSets.map((set) => [set.id, set]),
        );

        const requestedIds = sets.flatMap((set) => (set.id ? [set.id] : []));

        // 4. Every supplied ID must belong to this exercise association.
        for (const setId of requestedIds) {
            if (!existingSetMap.has(setId)) {
                throw new AppError("One or more sets not found", 404);
            }
        }

        const requestedIdSet = new Set(requestedIds);

        // 5. Delete existing sets omitted from the submitted collection.
        const removedIds = existingSets
            .filter((set) => !requestedIdSet.has(set.id))
            .map((set) => set.id);

        if (removedIds.length > 0) {
            await client.query(
                `
                    DELETE FROM workout_sets
                    WHERE workout_exercise_id = $1
                    AND id = ANY($2::uuid[])
                `,
                [workoutExerciseId, removedIds],
            );
        }

        const retainedSets = sets.flatMap((set, index) =>
            set.id
                ? [
                      {
                          id: set.id,
                          position: index + 1,
                          reps: set.reps,
                          weight: set.weight ?? null,
                      },
                  ]
                : [],
        );

        // 6. Check whether existing sets need new positions.
        const needsReordering = retainedSets.some(
            (set) => existingSetMap.get(set.id)!.set_number !== set.position,
        );

        if (needsReordering && retainedSets.length > 0) {
            const maxSetNumber = existingSets.reduce(
                (max, set) => Math.max(max, set.set_number),
                0,
            );

            const offset = maxSetNumber + sets.length + 1;
            const intMax = 2147483647;

            if (maxSetNumber + offset > intMax) {
                throw new Error(
                    "Set positions exceed the supported integer range",
                );
            }

            // Temporarily move retained sets to unused positive positions.
            // This avoids conflicts with UNIQUE(workout_exercise_id, set_number).
            await client.query(
                `
                    UPDATE workout_sets
                    SET set_number = set_number + $2
                    WHERE workout_exercise_id = $1
                    AND id = ANY($3::uuid[])
                `,
                [workoutExerciseId, offset, requestedIds],
            );
        }

        // 7. Update existing sets in one query.
        // IS DISTINCT FROM prevents unnecessary row updates when nothing changed.
        if (retainedSets.length > 0) {
            const updateValues: unknown[] = [workoutExerciseId];

            const updatePlaceholders = retainedSets.map((set) => {
                const offset = updateValues.length;

                updateValues.push(set.id, set.position, set.reps, set.weight);

                return `(
                    $${offset + 1}::uuid,
                    $${offset + 2}::integer,
                    $${offset + 3}::integer,
                    $${offset + 4}::numeric
                )`;
            });

            await client.query(
                `
                    UPDATE workout_sets AS ws
                    SET
                        set_number = v.set_number,
                        reps = v.reps,
                        weight = v.weight
                    FROM (
                        VALUES ${updatePlaceholders.join(", ")}
                    ) AS v(id, set_number, reps, weight)
                    WHERE ws.workout_exercise_id = $1
                    AND ws.id = v.id
                    AND (
                        ws.set_number IS DISTINCT FROM v.set_number
                        OR ws.reps IS DISTINCT FROM v.reps
                        OR ws.weight IS DISTINCT FROM v.weight
                    )
                `,
                updateValues,
            );
        }

        // 8. Insert new sets. Their positions come from the request order.
        const newSets = sets.flatMap((set, index) =>
            set.id
                ? []
                : [
                      {
                          set_number: index + 1,
                          reps: set.reps,
                          weight: set.weight ?? null,
                      },
                  ],
        );

        if (newSets.length > 0) {
            const insertValues: unknown[] = [];
            const insertPlaceholders = newSets.map((set) => {
                const offset = insertValues.length;

                insertValues.push(
                    workoutExerciseId,
                    set.set_number,
                    set.reps,
                    set.weight,
                );

                return `(
                    $${offset + 1},
                    $${offset + 2},
                    $${offset + 3},
                    $${offset + 4}
                )`;
            });

            await client.query(
                `
                    INSERT INTO workout_sets (
                        workout_exercise_id,
                        set_number,
                        reps,
                        weight
                    )
                    VALUES ${insertPlaceholders.join(", ")}
                `,
                insertValues,
            );
        }

        // 9. Fetch the final database state for the response.
        const updatedSetsResult = await client.query<WorkoutSetResponse>(
            `
                SELECT id, set_number, reps, weight
                FROM workout_sets
                WHERE workout_exercise_id = $1
                ORDER BY set_number
            `,
            [workoutExerciseId],
        );

        await client.query("COMMIT");

        return {
            workoutExerciseId,
            sets: updatedSetsResult.rows,
        };
    } catch (error) {
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error("Transaction rollback failed:", rollbackError);
        }

        throw error;
    } finally {
        client.release();
    }
};

const deleteWorkoutExercises = async ({
    workoutId,
    userId,
    workoutExerciseIds,
}: DeleteWorkoutExercisesParams) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Verify ownership and lock the workout.
        const workoutResult = await client.query(
            `
                SELECT id FROM workouts WHERE id = $1 AND user_id = $2 FOR UPDATE
            `,
            [workoutId, userId],
        );

        if (workoutResult.rows.length === 0) {
            throw new AppError("Workout not found", 404);
        }

        // 2. Validate that every requested association belongs to this workout.
        const associationResult = await client.query(
            `
                SELECT id
                FROM workout_exercises
                WHERE workout_id = $1
                  AND id = ANY($2::uuid[])
                FOR UPDATE
            `,
            [workoutId, workoutExerciseIds],
        );

        if (associationResult.rows.length !== workoutExerciseIds.length) {
            throw new AppError(
                "One or more exercises were not found in this workout",
                404,
            );
        }

        // 3. Get the current exercise count and highest position.
        const statsResult = await client.query<WorkoutExerciseStats>(
            `
                SELECT
                    COUNT(*)::int AS total_exercises,
                    COALESCE(MAX(position), 0)::int AS max_position
                FROM workout_exercises
                WHERE workout_id = $1
            `,
            [workoutId],
        );

        const { total_exercises, max_position } = statsResult.rows[0];

        // 4. Never allow the workout to become empty.
        if (total_exercises - workoutExerciseIds.length < 1) {
            throw new AppError(
                "A workout must contain at least one exercise",
                400,
            );
        }

        // 5. Delete the requested associations.
        // Their workout_sets are deleted through ON DELETE CASCADE.
        await client.query(
            `
                DELETE FROM workout_exercises
                WHERE workout_id = $1
                  AND id = ANY($2::uuid[])
            `,
            [workoutId, workoutExerciseIds],
        );

        // 6. Move remaining positions to a temporary range.
        // This avoids conflicts with UNIQUE(workout_id, position).
        const offset = max_position + 1;
        const maxInteger = 2147483647;

        if (max_position + offset > maxInteger) {
            throw new AppError(
                "Workout exercise positions exceed the supported range",
                409,
            );
        }

        await client.query(
            `
                UPDATE workout_exercises
                SET position = position + $2
                WHERE workout_id = $1
            `,
            [workoutId, offset],
        );

        // 7. Reassign sequential positions while preserving relative order.
        await client.query(
            `
                WITH ordered_exercises AS (
                    SELECT
                        id,
                        ROW_NUMBER() OVER (ORDER BY position)::int AS new_position
                    FROM workout_exercises
                    WHERE workout_id = $1
                )
                UPDATE workout_exercises AS we
                SET position = ordered_exercises.new_position
                FROM ordered_exercises
                WHERE we.id = ordered_exercises.id
            `,
            [workoutId],
        );

        await client.query("COMMIT");

        return {
            deletedWorkoutExerciseIds: workoutExerciseIds,
            remainingExerciseCount: total_exercises - workoutExerciseIds.length,
        };
    } catch (error) {
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error("Transaction rollback failed:", rollbackError);
        }

        throw error;
    } finally {
        client.release();
    }
};

export { syncWorkoutExerciseSets, deleteWorkoutExercises };
