// routes/inscription.routes.js
import { Router } from "express";
import inscriptionController from "../controllers/inscription/inscription.controllers.js";

const router = Router();

router.post("/", inscriptionController.createInscription);
router.get("/:userId", inscriptionController.getInscriptionsByUser);
router.delete("/:id", inscriptionController.deleteInscription);

export default router;
