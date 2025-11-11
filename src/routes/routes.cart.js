import { Router } from "express";
import cartController from "../controllers/cart/cart.controllers.js";

const router = Router();

router.get("/all/:userId", cartController.getAllCarts);
router.get("/:userId", cartController.getOrCreateActiveCart);
router.post("/add/:idCart", cartController.addToCart);
router.delete("/remove/:idCart", cartController.removeFromCart);
router.post("/checkout/:userId", cartController.createCheckoutCart);

export default router;