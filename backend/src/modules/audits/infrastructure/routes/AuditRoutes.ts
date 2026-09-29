import { Router } from "express";
import { AuditController } from "../controllers/AuditController";
import { authMiddleware } from "../../../../shared/middleware/auth.middleware";
import { adminMiddleware } from "../../../../shared/middleware/admin.middleware";

const router = Router();

router.get("/audits", authMiddleware, adminMiddleware, AuditController.getAll);
router.get("/audits/:id", authMiddleware, adminMiddleware, AuditController.getById);

export default router;
