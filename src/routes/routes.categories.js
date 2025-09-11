import { Router } from "express";
import categoriesControllers from "../controllers/categories/categories.controllers.js";

const router = Router();

router.get('/', categoriesControllers.getAllCategories);
router.get('/:id', categoriesControllers.getCategoryById);
router.put('/:id', categoriesControllers.updateCategory);
router.post('/', categoriesControllers.createCategory);
router.patch('/:id', categoriesControllers.statusCategory);

export default router;