import { Router } from "express";
import activityController from "../controllers/activity/activity.controllers.js";

const router = Router();

router.get("/", activityController.getAllActivities);
router.get("/:id", activityController.getActivityById);
router.post("/", activityController.createActivity);
router.delete("/:id", activityController.deleteActivity);
router.put("/:id", activityController.updateActivity);
router.delete("/:id", activityController.deleteActivity);

export default router;
