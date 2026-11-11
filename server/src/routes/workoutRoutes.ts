import { Router } from "express";
import {
    addExerciseToWorkout,
    createWorkout,
    deleteWorkout,
    getAllWorkouts,
    getWorkoutById,
    updateWorkout,
} from "../controllers/workoutController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware.js";

const router = Router();

router.get("/", optionalAuthMiddleware, getAllWorkouts);
router.get("/:id", optionalAuthMiddleware, getWorkoutById);

router.use(authMiddleware);

router.post("/", createWorkout);
router.post("/:id/exercises", addExerciseToWorkout);
router.patch("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;
