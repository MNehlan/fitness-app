import { Router } from 'express';
import { createWorkout, deleteWorkout, getAllWorkouts, getWorkoutById, updateWorkout } from '../controllers/workoutController.js';

const router = Router();

router.post('/create', createWorkout);

router.get('/', getAllWorkouts);

router.get('/:id', getWorkoutById);

router.patch('/:id', updateWorkout);

router.delete('/:id', deleteWorkout);

export default router;