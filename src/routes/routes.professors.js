import { Router } from "express";
const router = Router();
import professorController from "../controllers/professors/professors.controller.js";

router.get("/", professorController.getAllProfessors);
router.get("/:id", professorController.getProfessorsById);
router.put("/:id", professorController.updateProfessor);
router.post("/", professorController.createProfessor);
router.delete("/:id", professorController.deleteProfessor);

export default router;
