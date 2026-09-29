import { Router } from "express";
import { RoleController } from "../controllers/RoleController";
import { authMiddleware } from "../../../../shared/middleware/auth.middleware";
import { adminMiddleware } from "../../../../shared/middleware/admin.middleware";
import { validateCreateRole, validateRenameRole, validateAssignRole } from "../validations/role-validation";

const router = Router();

router.post("/roles", authMiddleware, adminMiddleware, validateCreateRole, RoleController.create); // HU-06
router.patch("/roles/:id", authMiddleware, adminMiddleware, validateRenameRole, RoleController.rename); // HU-07
router.delete("/roles/:id", authMiddleware, adminMiddleware, RoleController.remove); // HU-08
router.patch("/users/:userId/role", authMiddleware, adminMiddleware, validateAssignRole, RoleController.assignToUser); // HU-09
router.get("/roles", authMiddleware, adminMiddleware, RoleController.getAll);

export default router;
