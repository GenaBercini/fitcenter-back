import { Router } from "express";
import controller from "../controllers/subsidiary/subsidiary.controllers.js";
const router = Router();

router.get("/", controller.getAllSubsidiary);
router.get("/:id", controller.getSubsidiaryById);
router.post("/", controller.createSubsidiary);
router.put("/:id", controller.updateSubsidiary);
router.delete("/:id", controller.deleteSubsidiary);

export default router;
