import { Router } from "express";
import routinesController from "../controllers/routines/routines.controllers.js";
const router = Router();

router.get('/', routinesController.getAllRoutines);
router.get('/:id', routinesController.getRoutineById);
router.post('/', routinesController.createRoutine);
router.patch('/:id', routinesController.statusRoutine);

export default router;