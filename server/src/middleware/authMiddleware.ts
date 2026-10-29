import type { Request, Response, NextFunction } from "express";
import * as z from "zod";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import { env } from "../config/env.js";
import pool from "../db.js";

const authMiddleware = async (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const authorization = req.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
        throw new AppError("Authentication required", 401);
    }

    const token = authorization.slice(7).trim();

    if (!token) {
        throw new AppError("Authentication required", 401);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const payloadResult = z
        .object({
            userId: z.uuid(),
        })
        .safeParse(decoded);

    if (!payloadResult.success) {
        throw new AppError("Invalid token", 401);
    }

    const user = await pool.query("SELECT id FROM users WHERE id = $1", [
        payloadResult.data.userId,
    ]);

    if (user.rows.length === 0) {
        throw new AppError("User no longer exists", 401);
    }

    req.user = {
        id: user.rows[0].id,
    };

    next();
};

export default authMiddleware;