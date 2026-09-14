import { Router } from "express";
import orderPurchaseControllers from "../controllers/orderPurchase/orderPurchase.controllers.js";

const router = Router();

router.get("/", orderPurchaseControllers.getAllOrderPurchase);
router.get("/:id", orderPurchaseControllers.getOrderPurchaseById);
router.put("/:id", orderPurchaseControllers.updateOrderPurchase);
router.post("/", orderPurchaseControllers.createOrderPurchase);
router.patch("/:id", orderPurchaseControllers.statusOrderPurchase);

export default router;
