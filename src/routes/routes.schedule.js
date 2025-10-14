import { Router } from "express";
import scheduleController from "../controllers/schedule/schedule.controllers.js";

const router = Router();

// GET all schedules
router.get("/", scheduleController.getAllSchedules);

// GET schedule by ID
router.get("/:id", scheduleController.getScheduleById);

// POST new schedule
router.post("/", scheduleController.createSchedule);

// PUT update schedule
router.put("/:id", scheduleController.updateSchedule);

// DELETE schedule
router.delete("/:id", scheduleController.deleteSchedule);

export default router;
