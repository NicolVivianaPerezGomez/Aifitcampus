import { Router } from "express";
import { StatsController } from "../controllers/StatsController";
import { authMiddleware } from "../../../../shared/middleware/auth.middleware";
import { adminMiddleware } from "../../../../shared/middleware/admin.middleware";

const router = Router();

router.get("/stats/advanced", authMiddleware, adminMiddleware, StatsController.getAdvanced);

export default router;
