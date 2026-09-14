import { Router } from "express";
const router = Router();
import clientController from "../controllers/clients/clients.controller.js";

router.get("/", clientController.getAllClients);
router.get("/:id", clientController.getClientById);
router.post("/", clientController.createClient);
router.delete("/:id", clientController.deleteClient);

export default router;
