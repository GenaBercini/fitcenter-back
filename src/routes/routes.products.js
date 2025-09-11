import { Router } from "express";
import productsController from "../controllers/products/products.controllers.js";
const router = Router();

router.get("/", productsController.getAllProducts);
router.get("/:id", productsController.getProductById);
router.put("/:id", productsController.updateProduct);
router.post("/", productsController.createProduct);
router.patch("/:id", productsController.statusProduct);

export default router;
