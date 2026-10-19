import { Router } from "express";
import contactController from "../controllers/contact/contact.controller.js";

const router = Router();

router.post("/", contactController.sendMessage);

export default router;