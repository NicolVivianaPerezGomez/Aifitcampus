import { Router } from "express";
import { BadgeController } from "../controllers/BadgeController";
import { UserBadgeController } from "../controllers/UserBadgeController";
import { authMiddleware } from "../../../../shared/middleware/auth.middleware";
import { adminMiddleware } from "../../../../shared/middleware/admin.middleware";
import { validateCreateBadge, validateUpdateBadge } from "../validations/badge-validation";
import { validateAssignBadge } from "../validations/user-badge-validation";

const router = Router();

// Insignias
router.get("/badges", authMiddleware, BadgeController.getAll);
router.get("/badges/:id", authMiddleware, BadgeController.getById);
router.post("/badges", authMiddleware, adminMiddleware, validateCreateBadge, BadgeController.create);
router.patch("/badges/:id", authMiddleware, adminMiddleware, validateUpdateBadge, BadgeController.update);
router.delete("/badges/:id", authMiddleware, adminMiddleware, BadgeController.remove);

// Insignias de usuario (UserBadge)
router.get("/user-badges/user/:userId", authMiddleware, UserBadgeController.getByUser);
router.post("/user-badges", authMiddleware, adminMiddleware, validateAssignBadge, UserBadgeController.assign);
router.delete("/user-badges/:id", authMiddleware, adminMiddleware, UserBadgeController.remove);

export default router;
