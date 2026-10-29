import * as z from "zod";

const registerSchema = z.strictObject({
    name: z.string().trim().min(1).max(30),
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8).max(72),
});

const loginSchema = z.strictObject({
    email: z.email().trim().toLowerCase(),
    password: z.string(),
});

export { registerSchema, loginSchema };
