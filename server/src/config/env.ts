import "dotenv/config";
import * as z from "zod";

const envSchema = z.object({
    DATABASE_URL: z.url(),
    PORT: z.coerce.number().default(5000),
});

export const env = envSchema.parse(process.env);