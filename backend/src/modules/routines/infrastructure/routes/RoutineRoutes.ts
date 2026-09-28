import { Router } from "express";
import { RoutineController } from "../controllers/RoutineController";
import { RoutineTypeController } from "../controllers/RoutineTypeController";
import { authMiddleware } from "../../../../shared/middleware/auth.middleware";
import {
  validateCreateRoutine,
  validateUpdateRoutine,
  validateLogExecution,
  validateCreateRoutineType,
  validateUpdateRoutineType,
} from "../validations/routine-validation";

const router = Router();

// Tipos de rutina
router.get("/routine-types", authMiddleware, RoutineTypeController.getAll);
router.post("/routine-types", authMiddleware, validateCreateRoutineType, RoutineTypeController.create);
router.patch("/routine-types/:id", authMiddleware, validateUpdateRoutineType, RoutineTypeController.update);
router.delete("/routine-types/:id", authMiddleware, RoutineTypeController.remove);

// Rutinas
router.get("/routines", authMiddleware, RoutineController.getAll);
router.get("/routines/history/me", authMiddleware, RoutineController.history); // antes de /:id
router.get("/routines/:id", authMiddleware, RoutineController.getById);
router.post("/routines", authMiddleware, validateCreateRoutine, RoutineController.create);
router.patch("/routines/:id", authMiddleware, validateUpdateRoutine, RoutineController.update);
router.delete("/routines/:id", authMiddleware, RoutineController.remove);
router.post("/routines/:id/execute", authMiddleware, validateLogExecution, RoutineController.execute);

export default router;
