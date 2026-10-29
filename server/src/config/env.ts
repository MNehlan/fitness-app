import "dotenv/config";
import * as z from "zod";

const envSchema = z.object({
    DATABASE_URL: z.url(),
    PORT: z.coerce.number().default(5000),
    JWT_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
