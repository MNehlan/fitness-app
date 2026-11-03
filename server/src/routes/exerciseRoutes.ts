import express from "express";
import {
    getExercises,
    createExercise,
    updateExercise,
    deleteExercise,
} from "../controllers/exerciseController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware.js";

const router = express.Router();

router.get("/", optionalAuthMiddleware, getExercises);

router.use(authMiddleware);

router.post("/", createExercise);
router.patch("/:id", updateExercise);
router.delete("/:id", deleteExercise);

export default router;
