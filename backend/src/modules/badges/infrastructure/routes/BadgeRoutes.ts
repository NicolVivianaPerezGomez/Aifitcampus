import { Router } from "express";
import { BadgeController } from "../controllers/BadgeController";
import { authMiddleware } from "../../../../shared/middleware/auth.middleware";
import { validateCreateBadge, validateUpdateBadge } from "../validations/badge-validation";

const router = Router();

// Insignias
router.get("/badges", authMiddleware, BadgeController.getAll);
router.get("/badges/:id", authMiddleware, BadgeController.getById);
router.post("/badges", authMiddleware, validateCreateBadge, BadgeController.create);
router.patch("/badges/:id", authMiddleware, validateUpdateBadge, BadgeController.update);
router.delete("/badges/:id", authMiddleware, BadgeController.remove);

export default router;
