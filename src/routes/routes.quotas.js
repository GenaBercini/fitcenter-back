import { Router } from "express";
import quotasControllers from "../controllers/quotas/quotas.controllers.js";

const router = Router();

router.get("/", quotasControllers.getAllQuota);
router.get("/:id", quotasControllers.getQuotaById);
router.put("/:id", quotasControllers.updateQuota);
router.post("/", quotasControllers.createQuota);
router.patch("/:id", quotasControllers.statusQuota);

export default router;
