import type { Request, Response } from 'express';
import { exerciseSchema } from '../schemas/exerciseSchema.js';
import pool from '../db.js';

const getExercises = async (_req: Request, res: Response) => {
  try {
    const data = await pool.query('select * from exercises');
    res.json(data.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

const createExercise = async (req: Request, res: Response) => {
  try {
    const result = exerciseSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ message: 'Invalid exercise data' });
    }

    const { name, description } = result.data;

    const insertExercise = await pool.query(
      'INSERT INTO exercises (name, description) VALUES ($1, $2) RETURNING *',
      [name, description],
    );
    res.status(201).json({
      data: insertExercise.rows[0],
      message: 'Exercise created successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

export { getExercises, createExercise };
