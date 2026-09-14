import { Router } from "express";
const router = Router();
import administratorController from "../controllers/administrators/administrators.controller.js";

router.get('/', administratorController.getAllAdministrators);
router.get('/:id', administratorController.getAdministratorById);
router.put('/:id', administratorController.updateAdministrator);
router.post('/', administratorController.createAdministrator);
router.delete('/:id', administratorController.deleteAdministrator);

export default router;