import type { Request, Response } from "express";
import pool from "../db.js";
import {
    createWorkoutSchema,
    updateWorkoutSchema,
    workoutIdParamSchema,
} from "../schemas/workoutSchema.js";
import AppError from "../utils/AppError.js";
import sendResponse from "../utils/sendResponse.js";

const createWorkout = async (req: Request, res: Response) => {
    const result = createWorkoutSchema.safeParse(req.body);

    if (!result.success) {
        throw new AppError("Invalid workout data", 400);
    }

    const { name, difficulty } = result.data;
    const userId = req.user!.id;

    const query = `
    INSERT INTO workouts (name, difficulty, user_id)
    VALUES ($1, $2, $3)
    RETURNING id, name, difficulty, created_at, updated_at
  `;

    const { rows } = await pool.query(query, [name, difficulty, userId]);

    return sendResponse(res, {
        statusCode: 201,
        data: rows[0],
        message: "Workout created successfully",
    });
};

const getAllWorkouts = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const query = userId
        ? `SELECT id, name, difficulty, created_at, updated_at
       FROM workouts
       WHERE user_id IS NULL OR user_id = $1
       ORDER BY created_at DESC`
        : `SELECT id, name, difficulty, created_at, updated_at
       FROM workouts
       WHERE user_id IS NULL
       ORDER BY created_at DESC`;

    const result = userId
        ? await pool.query(query, [userId])
        : await pool.query(query);

    return sendResponse(res, {
        statusCode: 200,
        data: result.rows,
        message: "Workouts fetched successfully",
    });
};

const getWorkoutById = async (req: Request, res: Response) => {
    const result = workoutIdParamSchema.safeParse(req.params);

    if (!result.success) {
        throw new AppError("Invalid workout id", 400);
    }

    const { id } = result.data;
    const userId = req.user?.id;

    const query = userId
        ? `SELECT id, name, difficulty, created_at, updated_at
       FROM workouts
       WHERE id = $1 AND (user_id IS NULL OR user_id = $2)`
        : `SELECT id, name, difficulty, created_at, updated_at
       FROM workouts
       WHERE id = $1 AND user_id IS NULL`;

    const values = userId ? [id, userId] : [id];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
        throw new AppError("Workout not found", 404);
    }

    return sendResponse(res, {
        statusCode: 200,
        data: rows[0],
        message: "Workout fetched successfully",
    });
};

const updateWorkout = async (req: Request, res: Response) => {
    const paramResult = workoutIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
        throw new AppError("Invalid workout id", 400);
    }

    const { id } = paramResult.data;

    const bodyResult = updateWorkoutSchema.safeParse(req.body);

    if (!bodyResult.success) {
        throw new AppError("Invalid workout data", 400);
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
    UPDATE workouts
    SET ${fields.join(", ")}, updated_at = now()
    WHERE id = $${idPlaceholder} AND user_id = $${userIdPlaceholder}
    RETURNING id, name, difficulty, created_at, updated_at
  `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new AppError("Workout not found", 404);
    }

    return sendResponse(res, {
        statusCode: 200,
        data: result.rows[0],
        message: "Workout updated successfully",
    });
};

const deleteWorkout = async (req: Request, res: Response) => {
    const paramResult = workoutIdParamSchema.safeParse(req.params);

    if (!paramResult.success) {
        throw new AppError("Invalid workout id", 400);
    }

    const { id } = paramResult.data;
    const userId = req.user!.id;

    const query = `
    DELETE FROM workouts
    WHERE id = $1 AND user_id = $2
    RETURNING id
  `;

    const result = await pool.query(query, [id, userId]);

    if (result.rows.length === 0) {
        throw new AppError("Workout not found", 404);
    }

    return sendResponse(res, {
        statusCode: 200,
        message: "Workout deleted successfully",
    });
};

export {
    createWorkout,
    getAllWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
};
