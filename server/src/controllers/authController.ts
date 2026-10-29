import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db.js";
import { env } from "../config/env.js";
import { loginSchema, registerSchema } from "../schemas/authSchema.js";
import AppError from "../utils/AppError.js";
import sendResponse from "../utils/sendResponse.js";

const register = async (req: Request, res: Response) => {
    const resultValidation = registerSchema.safeParse(req.body);

    if (!resultValidation.success) {
        throw new AppError("Invalid registration fields", 400);
    }

    const { name, email, password } = resultValidation.data;

    const passwordHash = await bcrypt.hash(password, 10);

    const query =
        "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email";
    const values = [name, email, passwordHash];

    const result = await pool.query(query, values);

    return sendResponse(res, {
        statusCode: 201,
        data: result.rows[0],
        message: "Account created successfully",
    });
};

const login = async (req: Request, res: Response) => {
    const resultValidation = loginSchema.safeParse(req.body);

    if (!resultValidation.success) {
        throw new AppError("Invalid login fields", 400);
    }

    const { email, password } = resultValidation.data;

    const query =
        "SELECT id, name, email, password_hash FROM users WHERE email = $1";
    const values = [email];

    const user = await pool.query(query, values);

    if (user.rows.length === 0) {
        throw new AppError("Invalid email or password", 401);
    }

    const foundUser = user.rows[0];

    const isMatch = await bcrypt.compare(password, foundUser.password_hash);

    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }

    const token = jwt.sign(
        { userId: foundUser.id }, 
        env.JWT_SECRET, {
        expiresIn: "1d",
    });

    return sendResponse(res, {
        statusCode: 200,
        data: {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            token
        },
        message: "Login successful",
    });
};
export { register, login };
