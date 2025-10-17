import { Router } from "express";
import activityController from "../controllers/activity/activity.controllers.js";

const router = Router();

// GET all activities
router.get("/", activityController.getAllActivities);

// GET activity by ID
router.get("/:id", activityController.getActivityById);

// POST new activity
router.post("/", activityController.createActivity);

// PUT update activity
router.put("/:id", activityController.updateActivity);

// DELETE activity
router.delete("/:id", activityController.deleteActivity);

// router.inscribir("/:id/inscribir", activityController.inscribeActivity);

export default router;
