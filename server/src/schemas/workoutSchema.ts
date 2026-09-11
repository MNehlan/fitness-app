import * as z from 'zod';

const workoutSchema = z.strictObject({
  name: z.string().trim().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

const createWorkoutSchema = workoutSchema.extend({
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
});

const updateWorkoutSchema = workoutSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field required',
  });

const workoutIdParamSchema = z.object({
  id: z.uuid(),
});

export { workoutSchema, createWorkoutSchema, updateWorkoutSchema, workoutIdParamSchema };