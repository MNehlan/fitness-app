import type { Request, Response } from 'express';
import pool from '../db.js';
import {
  exerciseSchema,
  updateExerciseSchema,
} from '../schemas/exerciseSchema.js';
import AppError from '../utils/AppError.js';
import sendResponse from '../utils/sendResponse.js';

//Get all exercises
const getExercises = async (_req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM exercises');
  return sendResponse(res, { statusCode: 200, data: result.rows });
};

//Create a exercise
const createExercise = async (req: Request, res: Response) => {
  const resultValidation = exerciseSchema.safeParse(req.body);

  if (!resultValidation.success) {
    throw new AppError('Invalid exercise data', 400);
  }

  const { name, description } = resultValidation.data;

  const result = await pool.query(
    'INSERT INTO exercises (name, description) VALUES ($1, $2) RETURNING *',
    [name, description],
  );

  return sendResponse(res, {
    statusCode: 201,
    data: result.rows[0],
    message: 'Exercise created successfully',
  });
};

//Update a exercise
const updateExercise = async (req: Request, res: Response) => {
  const { id } = req.params;
  const resultValidation = updateExerciseSchema.safeParse(req.body);

  if (!resultValidation.success) {
    throw new AppError('Invalid exercise data', 400);
  }

  const { data } = resultValidation;

  const fields: string[] = [];
  const values: unknown[] = [];

  Object.entries(data).forEach(([key, value]) => {
    const placeholder = values.length + 1;

    fields.push(`${key} = $${placeholder}`);

    values.push(value);
  });

  const idPlaceholder = values.length + 1;
  values.push(id);

  const query = `UPDATE exercises SET ${fields.join(', ')} WHERE id = $${idPlaceholder} RETURNING *`;
  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new AppError('Exercise not found', 404);
  }

  return sendResponse(res, {
    statusCode: 200,
    data: result.rows[0],
    message: 'Exercise updated successfully',
  });
};

//Delete exercise
const deleteExercise = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM exercises WHERE id = $1 RETURNING *',
    [id],
  );

  if (result.rows.length === 0) {
    throw new AppError('Exercise not found', 404);
  }

  return sendResponse(res, {
    statusCode: 200,
    message: 'Exercise deleted successfully',
  });
};

export { getExercises, createExercise, updateExercise, deleteExercise };
