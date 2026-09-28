import { Router } from "express";
import { ExerciseController } from "../controllers/ExerciseController";
import { ExerciseCategoryController } from "../controllers/ExerciseCategoryController";
import { authMiddleware } from "../../../../shared/middleware/auth.middleware";
import {
  validateCreateExercise,
  validateUpdateExercise,
  validateCreateExerciseCategory,
  validateUpdateExerciseCategory,
} from "../validations/exercise-validation";

const router = Router();

// Categorías de ejercicios
router.get("/exercise-categories", authMiddleware, ExerciseCategoryController.getAll);
router.post("/exercise-categories", authMiddleware, validateCreateExerciseCategory, ExerciseCategoryController.create);
router.patch("/exercise-categories/:id", authMiddleware, validateUpdateExerciseCategory, ExerciseCategoryController.update);
router.delete("/exercise-categories/:id", authMiddleware, ExerciseCategoryController.remove);

// Ejercicios (por video)
router.get("/exercises", authMiddleware, ExerciseController.getAll);
router.get("/exercises/:id", authMiddleware, ExerciseController.getById);
router.post("/exercises", authMiddleware, validateCreateExercise, ExerciseController.create);
router.patch("/exercises/:id", authMiddleware, validateUpdateExercise, ExerciseController.update);
router.delete("/exercises/:id", authMiddleware, ExerciseController.remove);

export default router;
