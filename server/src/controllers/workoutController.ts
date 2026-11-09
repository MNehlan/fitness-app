import type { Request, Response } from "express";
import pool from "../db.js";
import {
    createWorkoutSchema,
    updateWorkoutSchema,
    workoutIdParamSchema,
} from "../schemas/workoutSchema.js";
import AppError from "../utils/AppError.js";
import sendResponse from "../utils/sendResponse.js";
import type {
    CreatedWorkout,
    WorkoutDetailResponse,
    WorkoutDetailRow,
} from "../types/workout.js";

const createWorkout = async (req: Request, res: Response) => {
    const validatedData = createWorkoutSchema.safeParse(req.body);

    if (!validatedData.success) {
        throw new AppError("Invalid workout data", 400);
    }

    const { name, difficulty, exercises } = validatedData.data;
    const userId = req.user!.id;

    const client = await pool.connect();

    let createdWorkout: CreatedWorkout;

    try {
        await client.query("BEGIN");

        const exerciseIds = exercises.map((exercise) => exercise.exerciseId);

        const exerciseQuery = `
            SELECT id FROM exercises
            WHERE id = ANY($1::uuid[])
            AND (user_id IS NULL OR user_id = $2)
        `;

        const { rows: exerciseRows } = await client.query(exerciseQuery, [
            exerciseIds,
            userId,
        ]);

        if (exerciseRows.length !== exerciseIds.length) {
            throw new AppError("One or more exercises not found", 404);
        }

        const query = `
            INSERT INTO workouts (name, difficulty, user_id)
            VALUES ($1, $2, $3)
            RETURNING id, name, difficulty, created_at, updated_at
        `;
        const { rows: workoutRows } = await client.query(query, [
            name,
            difficulty,
            userId,
        ]);

        const workoutId = workoutRows[0].id;

        const exerciseValues: unknown[] = [];

        const exercisePlaceholders = exercises.map((exercise, index) => {
            const position = index + 1;
            const offset = index * 3;

            exerciseValues.push(workoutId, exercise.exerciseId, position);

            return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
        });

        const exerciseInsertQuery = `
            INSERT INTO workout_exercises (workout_id, exercise_id, position)
            VALUES ${exercisePlaceholders.join(", ")}
            RETURNING id, exercise_id
        `;

        const { rows: workoutExerciseRows } = await client.query(
            exerciseInsertQuery,
            exerciseValues,
        );

        const workoutExerciseMap = new Map(
            workoutExerciseRows.map((row) => [row.exercise_id, row.id]),
        );

        const setValues: unknown[] = [];
        const setPlaceholders: string[] = [];

        for (const exercise of exercises) {
            const workoutExerciseId = workoutExerciseMap.get(
                exercise.exerciseId,
            );

            if (!workoutExerciseId) {
                throw new Error("Workout exercise ID not found");
            }

            for (const [index, set] of exercise.sets.entries()) {
                const offset = setValues.length;

                setValues.push(
                    workoutExerciseId,
                    index + 1,
                    set.reps,
                    set.weight ?? null,
                );

                setPlaceholders.push(
                    `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`,
                );
            }
        }

        const setInsertQuery = `
            INSERT INTO workout_sets (
            workout_exercise_id,
            set_number,
            reps,
            weight
            )
            VALUES ${setPlaceholders.join(", ")}
        `;

        await client.query(setInsertQuery, setValues);

        createdWorkout = workoutRows[0];

        await client.query("COMMIT");
    } catch (error) {
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error("Rollback failed", rollbackError);
        }

        throw error;
    } finally {
        client.release();
    }

    return sendResponse(res, {
        statusCode: 201,
        data: createdWorkout,
        message: "Workout created successfully",
    });
};

const getAllWorkouts = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const query = userId
        ? `SELECT id, name, difficulty, created_at, updated_at
       FROM workouts
       WHERE user_id IS NULL OR user_id = $1
       ORDER BY created_at DESC`
        : `SELECT id, name, difficulty, created_at, updated_at
       FROM workouts
       WHERE user_id IS NULL
       ORDER BY created_at DESC`;

    const result = userId
        ? await pool.query(query, [userId])
        : await pool.query(query);

    return sendResponse(res, {
        statusCode: 200,
        data: result.rows,
        message: "Workouts fetched successfully",
    });
};

const getWorkoutById = async (req: Request, res: Response) => {
    const validatedData = workoutIdParamSchema.safeParse(req.params);

    if (!validatedData.success) {
        throw new AppError("Invalid workout id", 400);
    }

    const { id } = validatedData.data;
    const userId = req.user?.id;

    const query = userId
        ? `
        SELECT
            w.id AS workout_id,
            w.name AS workout_name,
            w.difficulty,
            w.created_at,
            w.updated_at,

            we.id AS workout_exercise_id,
            we.exercise_id,
            we.position,

            e.name AS exercise_name,
            e.description AS exercise_description,

            ws.id AS set_id,
            ws.set_number,
            ws.reps,
            ws.weight

        FROM workouts w

        LEFT JOIN (
            workout_exercises we
            INNER JOIN exercises e
                ON e.id = we.exercise_id
                AND (e.user_id IS NULL OR e.user_id = $2)
        )
            ON we.workout_id = w.id

        LEFT JOIN workout_sets ws
            ON ws.workout_exercise_id = we.id

        WHERE w.id = $1
            AND (w.user_id IS NULL OR w.user_id = $2)

        ORDER BY we.position, ws.set_number
    `
        : `
        SELECT
            w.id AS workout_id,
            w.name AS workout_name,
            w.difficulty,
            w.created_at,
            w.updated_at,

            we.id AS workout_exercise_id,
            we.exercise_id,
            we.position,

            e.name AS exercise_name,
            e.description AS exercise_description,

            ws.id AS set_id,
            ws.set_number,
            ws.reps,
            ws.weight

        FROM workouts w

        LEFT JOIN (
            workout_exercises we
            INNER JOIN exercises e
                ON e.id = we.exercise_id
                AND e.user_id IS NULL
        )
            ON we.workout_id = w.id

        LEFT JOIN workout_sets ws
            ON ws.workout_exercise_id = we.id

        WHERE w.id = $1

        ORDER BY we.position, ws.set_number
    `;

    const values = userId ? [id, userId] : [id];

    const { rows } = await pool.query<WorkoutDetailRow>(query, values);

    const workoutMap = new Map<string, WorkoutDetailResponse>();

    for (const row of rows) {
        if (!workoutMap.has(row.workout_id)) {
            workoutMap.set(row.workout_id, {
                id: row.workout_id,
                name: row.workout_name,
                difficulty: row.difficulty,
                created_at: row.created_at,
                updated_at: row.updated_at,
                exercises: [],
            });
        }

        if (!row.workout_exercise_id) {
            continue;
        }

        if (!row.exercise_id || !row.exercise_name || row.position === null) {
            throw new Error("Invalid workout exercise data");
        }

        const workout = workoutMap.get(row.workout_id);

        if (!workout) {
            throw new Error("Workout aggregation failed");
        }

        let exercise = workout.exercises.find(
            (item) => item.workoutExerciseId === row.workout_exercise_id,
        );

        if (!exercise) {
            exercise = {
                workoutExerciseId: row.workout_exercise_id,
                id: row.exercise_id,
                name: row.exercise_name,
                description: row.exercise_description,
                position: row.position,
                sets: [],
            };

            workout.exercises.push(exercise);
        }

        if (row.set_id) {
            if (row.set_number === null || row.reps === null) {
                throw new Error("Invalid workout set data");
            }

            exercise.sets.push({
                set_number: row.set_number,
                reps: row.reps,
                weight: row.weight,
            });
        }
    }

    const workout = workoutMap.get(id);

    if (!workout) {
        throw new AppError("Workout not found", 404);
    }

    sendResponse(res, {
        statusCode: 200,
        message: "Workout fetched successfully",
        data: workout,
    });
};

const updateWorkout = async (req: Request, res: Response) => {
    const paramResult = workoutIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
        throw new AppError("Invalid workout id", 400);
    }

    const { id } = paramResult.data;

    const bodyResult = updateWorkoutSchema.safeParse(req.body);

    if (!bodyResult.success) {
        throw new AppError("Invalid workout data", 400);
    }

    const { data } = bodyResult;
    const userId = req.user!.id;

    const fields: string[] = [];
    const values: unknown[] = [];

    Object.entries(data).forEach(([key, value]) => {
        const placeholder = values.length + 1;
        fields.push(`${key} = $${placeholder}`);
        values.push(value);
    });

    const idPlaceholder = values.length + 1;
    values.push(id);

    const userIdPlaceholder = values.length + 1;
    values.push(userId);

    const query = `
    UPDATE workouts
    SET ${fields.join(", ")}, updated_at = now()
    WHERE id = $${idPlaceholder} AND user_id = $${userIdPlaceholder}
    RETURNING id, name, difficulty, created_at, updated_at
  `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new AppError("Workout not found", 404);
    }

    return sendResponse(res, {
        statusCode: 200,
        data: result.rows[0],
        message: "Workout updated successfully",
    });
};

const deleteWorkout = async (req: Request, res: Response) => {
    const paramResult = workoutIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
        throw new AppError("Invalid workout id", 400);
    }

    const { id } = paramResult.data;
    const userId = req.user!.id;

    const query = `
    DELETE FROM workouts
    WHERE id = $1 AND user_id = $2
    RETURNING id
  `;

    const result = await pool.query(query, [id, userId]);

    if (result.rows.length === 0) {
        throw new AppError("Workout not found", 404);
    }

    return sendResponse(res, {
        statusCode: 200,
        message: "Workout deleted successfully",
    });
};

export {
    createWorkout,
    getAllWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
};
