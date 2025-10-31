import { Router } from "express";
const router = Router();
import instructorController from "../controllers/instructors/instructors.controller.js";

router.get('/', instructorController.getAllInstructors);
router.get('/:id', instructorController.getInstructorById);
router.put('/:id', instructorController.updateInstructor);
router.post('/', instructorController.createInstructor);
router.delete('/:id', instructorController.deleteInstructor);

export default router;