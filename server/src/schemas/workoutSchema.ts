import * as z from "zod";

const workoutSchema = z.strictObject({
    name: z.string().trim().min(1).max(255),
    difficulty: z.enum(["easy", "medium", "hard"]),
});

const workoutSetSchema = z.strictObject({
    reps: z.int().positive(),
    weight: z.number().gte(0).nullable().optional(),
});

const workoutExerciseSchema = z.strictObject({
    exerciseId: z.uuid(),
    sets: z.array(workoutSetSchema).min(1),
});

const createWorkoutSchema = workoutSchema.extend({
    difficulty: workoutSchema.shape.difficulty.default("medium"),
    exercises: z
        .array(workoutExerciseSchema)
        .min(1)
        .refine(
            (exercises) =>
                new Set(exercises.map((exercise) => exercise.exerciseId))
                    .size === exercises.length,
            { message: "Duplicate exercises are not allowed" },
        ),
});

const updateWorkoutSchema = workoutSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field required",
    });

const workoutIdParamSchema = z.object({
    id: z.uuid(),
});

const workoutSetUpdateSchema = workoutSetSchema.extend({
    id: z.uuid().optional(),
});

const updateWorkoutExerciseSetsSchema = z.strictObject({
    sets: z
        .array(workoutSetUpdateSchema)
        .min(1)
        .refine(
            (sets) => {
                const ids = sets.flatMap((set) => (set.id ? [set.id] : []));
                return new Set(ids).size === ids.length;
            },
            { message: "Duplicate set IDs are not allowed" },
        ),
});

const workoutExerciseSetsParamSchema = z.strictObject({
    id: z.uuid(),
    workoutExerciseId: z.uuid(),
});

const deleteWorkoutExercisesSchema = z.strictObject({
    workoutExerciseIds: z
        .array(z.uuid())
        .min(1)
        .refine((ids) => new Set(ids).size === ids.length, {
            message: "Duplicate workout exercise are not allowed",
        }),
});

export {
    workoutSetSchema,
    workoutExerciseSchema,
    workoutSchema,
    createWorkoutSchema,
    updateWorkoutSchema,
    workoutIdParamSchema,
    updateWorkoutExerciseSetsSchema,
    workoutExerciseSetsParamSchema,
    deleteWorkoutExercisesSchema,
};
