import { Router } from "express";
import inscriptionController from "../controllers/inscription/inscription.controllers.js";

const router = Router();

// Crear inscripción
router.post("/", inscriptionController.createInscription);

// Traer inscripciones de un usuario
router.get("/:userName", inscriptionController.getInscriptionsByUser);

router.delete("/:id", inscriptionController.deleteInscription);

export default router;
