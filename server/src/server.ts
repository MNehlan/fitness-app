import express from 'express';
import 'dotenv/config';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT;

app.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Database error');
  }
});

app.get('/api/exercises', async (req, res) => {
  try {
    const data = await pool.query('select * from exercises')
    res.json(data.rows)
  } catch (error) {
    console.error(error);
    res.status(500).send('Database error')
  }
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
