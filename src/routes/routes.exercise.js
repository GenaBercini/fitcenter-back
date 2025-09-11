import { Router } from "express";
import exercisesControllers from "../controllers/exercise/exercise.controllers.js";

const router = Router();

router.get("/", exercisesControllers.getAllExercises);
router.get("/:id", exercisesControllers.getExerciseByid);
router.put("/:id", exercisesControllers.updateExercise);
router.post("/", exercisesControllers.createExercise);

export default router;
