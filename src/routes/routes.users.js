import { Router } from "express";
import usersController from "../controllers/users/users.controller.js";
const router = Router();

router.get("/", usersController.getAllUsers);
router.post("/register", usersController.createUser);
router.post("/login", usersController.loginUser);
router.post("/logout", usersController.logoutUser);
router.get("/session", usersController.sessionUser);
router.get("/auth/google", usersController.googleLogin);
router.post("/auth/google/save", usersController.googleSave);
router.get("/:id", usersController.getUserById);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

export default router;
