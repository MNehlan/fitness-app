import express from 'express';
import {
  getExercises,
  createExercise,
  updateExercise,
} from '../controllers/exerciseController.js';

const router = express.Router();

router.get('/', getExercises);
router.post('/create', createExercise);
router.patch('/:id', updateExercise);

export default router;
