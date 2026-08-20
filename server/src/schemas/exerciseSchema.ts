import * as z from 'zod';

const exerciseSchema = z.strictObject({
  name: z.string().trim().min(3),
  description: z.string().trim().optional(),
});

export { exerciseSchema };
