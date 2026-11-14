import { Router } from "express";
import {
    addExerciseToWorkout,
    createWorkout,
    deleteWorkout,
    getAllWorkouts,
    getWorkoutById,
    removeExercisesFromWorkout,
    updateWorkout,
    updateWorkoutExerciseSets,
    reorderExercisesInWorkout
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
router.put("/:id/exercises/:workoutExerciseId/sets", updateWorkoutExerciseSets);
router.put("/:id/exercises/reorder", reorderExercisesInWorkout);
router.delete("/:id", deleteWorkout);
router.delete("/:id/exercises", removeExercisesFromWorkout);

export default router;
