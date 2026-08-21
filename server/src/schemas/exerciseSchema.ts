import * as z from 'zod';

const exerciseSchema = z.strictObject({
  name: z.string().trim().min(3),
  description: z.string().trim().optional(),
});

const updateExerciseSchema = exerciseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field required',
  });

export { exerciseSchema, updateExerciseSchema };
