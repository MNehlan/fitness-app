import type { Request, Response } from 'express';
import {
  exerciseSchema,
  updateExerciseSchema,
} from '../schemas/exerciseSchema.js';
import pool from '../db.js';

//Get all exercises
const getExercises = async (_req: Request, res: Response) => {
  try {
    const data = await pool.query('select * from exercises');
    res.json(data.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

//Create a exercise
const createExercise = async (req: Request, res: Response) => {
  try {
    const resultValidation = exerciseSchema.safeParse(req.body);

    if (!resultValidation.success) {
      return res.status(400).json({
        message: 'Invalid exercise data',
      });
    }

    const { name, description } = resultValidation.data;

    const result = await pool.query(
      'INSERT INTO exercises (name, description) VALUES ($1, $2) RETURNING *',
      [name, description],
    );
    res.status(201).json({
      data: result.rows[0],
      message: 'Exercise created successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

//Update a exercise
const updateExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resultValidation = updateExerciseSchema.safeParse(req.body);

    if (!resultValidation.success) {
      return res.status(400).json({
        message: 'Invalid exercise data',
        errors: resultValidation.error.issues,
      });
    }

    const { name, description } = resultValidation.data;

    const fields: string[] = [];
    const values: unknown[] = [];

    if (name) {
      const placeholder = values.length + 1;
      fields.push(`name = $${placeholder}`);
      values.push(name);
    }

    if (description) {
      const placeholder = values.length + 1;
      fields.push(`description = $${placeholder}`);
      values.push(description);
    }

    const idPlaceholder = values.length + 1;
    values.push(id);

    const query = `UPDATE exercises SET ${fields.join(', ')} WHERE id = $${idPlaceholder} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Exercise not found',
      });
    }

    return res.status(200).json({
      data: result.rows[0],
      message: 'Exercise updated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

export { getExercises, createExercise, updateExercise };
