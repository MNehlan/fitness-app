import type { Request, Response } from 'express';
import pool from '../db.js';

const getExercises = async (req: Request, res: Response) => {
  try {
    const data = await pool.query('select * from exercises');
    res.json(data.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Database error');
  }
};

export { getExercises };
