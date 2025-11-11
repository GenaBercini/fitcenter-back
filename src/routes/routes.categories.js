import { Router } from "express";
import categoriesControllers from "../controllers/categories/categories.controllers.js";
import upload from "../middlewares/upload.js";
const router = Router();

router.get('/', categoriesControllers.getAllCategories);
router.get('/:id', categoriesControllers.getCategoryById);
router.put('/:id', upload.single("image"), categoriesControllers.updateCategory);
router.post('/', upload.single("image"), categoriesControllers.createCategory);
router.patch('/:id', categoriesControllers.statusCategory);

export default router;