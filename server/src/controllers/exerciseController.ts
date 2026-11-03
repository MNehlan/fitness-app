import type { Request, Response } from "express";
import pool from "../db.js";
import {
    exerciseSchema,
    updateExerciseSchema,
    exerciseIdParamSchema,
} from "../schemas/exerciseSchema.js";
import AppError from "../utils/AppError.js";
import sendResponse from "../utils/sendResponse.js";

const getExercises = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const query = userId
        ? `SELECT id, name, description, created_at, updated_at
       FROM exercises
       WHERE user_id IS NULL OR user_id = $1
       ORDER BY created_at ASC`
        : `SELECT id, name, description, created_at, updated_at
       FROM exercises
       WHERE user_id IS NULL
       ORDER BY created_at ASC`;

    const result = userId
        ? await pool.query(query, [userId])
        : await pool.query(query);

    return sendResponse(res, { statusCode: 200, data: result.rows });
};

const createExercise = async (req: Request, res: Response) => {
    const resultValidation = exerciseSchema.safeParse(req.body);

    if (!resultValidation.success) {
        throw new AppError("Invalid exercise data", 400);
    }

    const { name, description } = resultValidation.data;
    const userId = req.user!.id;

    const query = `
        INSERT INTO exercises (name, description, user_id)
        VALUES ($1, $2, $3)
        RETURNING id, name, description, created_at, updated_at
    `;
    const result = await pool.query(query, [name, description, userId]);

    return sendResponse(res, {
        statusCode: 201,
        data: result.rows[0],
        message: "Exercise created successfully",
    });
};

const updateExercise = async (req: Request, res: Response) => {
    const paramResult = exerciseIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
        throw new AppError("Invalid exercise id", 400);
    }

    const { id } = paramResult.data;

    const bodyResult = updateExerciseSchema.safeParse(req.body);

    if (!bodyResult.success) {
        throw new AppError("Invalid exercise data", 400);
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
        UPDATE exercises
        SET ${fields.join(", ")}, updated_at = now()
        WHERE id = $${idPlaceholder} AND user_id = $${userIdPlaceholder}
        RETURNING id, name, description, created_at, updated_at
    `;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new AppError("Exercise not found", 404);
    }

    return sendResponse(res, {
        statusCode: 200,
        data: result.rows[0],
        message: "Exercise updated successfully",
    });
};

const deleteExercise = async (req: Request, res: Response) => {
    const paramResult = exerciseIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
        throw new AppError("Invalid exercise id", 400);
    }

    const { id } = paramResult.data;
    const userId = req.user!.id;

    const result = await pool.query(
        "DELETE FROM exercises WHERE id = $1 AND user_id = $2 RETURNING id",
        [id, userId],
    );

    if (result.rows.length === 0) {
        throw new AppError("Exercise not found", 404);
    }

    return sendResponse(res, {
        statusCode: 200,
        message: "Exercise deleted successfully",
    });
};

export { getExercises, createExercise, updateExercise, deleteExercise };
