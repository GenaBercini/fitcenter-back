import { Router } from "express";
import productsController from "../controllers/products/products.controllers.js";
import upload from "../middlewares/upload.js";
const router = Router();

router.get("/", productsController.getAllProducts);
router.get("/:id", productsController.getProductById);
router.put("/:id", upload.single("image"), productsController.updateProduct);
router.post("/", upload.single("image"), productsController.createProduct);
router.patch("/:id", productsController.statusProduct);

export default router;