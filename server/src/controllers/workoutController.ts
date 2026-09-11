import type { Request, Response } from 'express';
import pool from '../db.js'; 
import { createWorkoutSchema, updateWorkoutSchema, workoutIdParamSchema } from '../schemas/workoutSchema.js';
import AppError from '../utils/AppError.js';
import sendResponse from '../utils/sendResponse.js';

const createWorkout = async (req: Request, res: Response) => {
  // 1. Validate the request body against the Zod schema
  const result = createWorkoutSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError('Validation Failed', 400);
  }

  const { name, difficulty } = result.data;
  // 2. Insert into the database
  const query = `INSERT INTO workouts (name, difficulty) VALUES ($1, $2) RETURNING *
    `;
  const { rows } = await pool.query(query, [name, difficulty]);

  // 3. Send back the created row
  return sendResponse(res, {
    statusCode: 201,
    data: rows[0],
    message: 'Workout created successfully',
  });
};

const getAllWorkouts = async (req: Request, res: Response) => {
  const query = `SELECT * FROM workouts ORDER BY created_at DESC`;
  const { rows } = await pool.query(query);

  return sendResponse(res, {
    statusCode: 200,
    data: rows,
    message: 'Workouts fetched successfully',
  });
};

const getWorkoutById = async (req: Request, res: Response) => {
  const result = workoutIdParamSchema.safeParse(req.params);

  if (!result.success) {
    throw new AppError('Invalid workout id', 400);
  }

  const { id } = result.data;

  const query = `SELECT * FROM workouts WHERE id = $1`;
  const { rows } = await pool.query(query, [id]);

  if (rows.length === 0) {
    throw new AppError('Workout not found', 404);
  }

  return sendResponse(res, {
    statusCode: 200,
    data: rows[0],
    message: 'Workout fetched successfully',
  });
};

const updateWorkout = async (req: Request, res: Response) => {
  const paramResult = workoutIdParamSchema.safeParse(req.params);

  if (!paramResult.success) {
    throw new AppError('Invalid workout id', 400);
  }

  const { id } = paramResult.data;

  const bodyResult = updateWorkoutSchema.safeParse(req.body);

  if (!bodyResult.success) {
    throw new AppError('Invalid workout data', 400);
  }

  const { data } = bodyResult;

  const fields: string[] = [];
  const values: unknown[] = [];

  Object.entries(data).forEach(([key, value]) => {
    const placeholder = values.length + 1;
    fields.push(`${key} = $${placeholder}`);
    values.push(value);
  });

  const idPlaceholder = values.length + 1;
  values.push(id);

  const query = `UPDATE workouts SET ${fields.join(', ')} WHERE id = $${idPlaceholder} RETURNING *`;
  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new AppError('Workout not found', 404);
  }

  return sendResponse(res, {
    statusCode: 200,
    data: result.rows[0],
    message: 'Workout updated successfully',
  });
};

const deleteWorkout = async (req: Request, res: Response) => {
  const paramResult = workoutIdParamSchema.safeParse(req.params);

  if (!paramResult.success) {
    throw new AppError('Invalid workout id', 400);
  }

  const { id } = paramResult.data;

  const query = `DELETE FROM workouts WHERE id = $1 RETURNING *`;
  const result = await pool.query(query, [id]);

  if (result.rows.length === 0) {
    throw new AppError('Workout not found', 404);
  }

  return sendResponse(res, {
    statusCode: 200,
    message: 'Workout deleted successfully',
  });
};

export { createWorkout, getAllWorkouts, getWorkoutById, updateWorkout,deleteWorkout };
