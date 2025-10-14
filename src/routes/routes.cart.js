import { Router } from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cart/cart.controllers.js";

const router = Router();

router.get("/", getCart);            
router.post("/add", addToCart);     
router.delete("/remove/:productId", removeFromCart); 

export default router;