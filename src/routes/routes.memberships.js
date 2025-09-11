import { Router } from "express";
const router = Router();
import membershipsController from "../controllers/memberships/memberships.controller.js";

router.get('/', membershipsController.getAllMemberships);
router.get('/:id', membershipsController.getMembershipById);
router.put('/:id', membershipsController.updateMembership);
router.post('/', membershipsController.createMembership);
router.delete('/:id', membershipsController.deleteMembership);

export default router;