import { Response } from "express";
import { AuthRequest } from "../../../../shared/middleware/auth.middleware";
import { AppError } from "../../../../shared/utils/AppError";

import { ExerciseCategoryAdapter } from "../adapters/ExerciseCategoryAdapter";
import { AuditAdapter } from "../../../audits/infrastructure/adapters/AuditAdapter";

import { CreateExerciseCategory } from "../../application/use-cases/CreateExerciseCategory";
import { GetExerciseCategories } from "../../application/use-cases/GetExerciseCategories";
import { UpdateExerciseCategory } from "../../application/use-cases/UpdateExerciseCategory";
import { DeactivateExerciseCategory } from "../../application/use-cases/DeactivateExerciseCategory";

const categoryAdapter = new ExerciseCategoryAdapter();
const auditAdapter = new AuditAdapter();

export class ExerciseCategoryController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const category = await new CreateExerciseCategory(categoryAdapter, auditAdapter).execute(
        req.body,
        req.user!.userId
      );
      return res.status(201).json(category);
    } catch (error) {
      return ExerciseCategoryController.handleError(error, res);
    }
  }

  // GET /exercise-categories?active=true
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const categories = await new GetExerciseCategories(categoryAdapter).execute(req.query.active === "true");
      return res.status(200).json(categories);
    } catch (error) {
      return ExerciseCategoryController.handleError(error, res);
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const category = await new UpdateExerciseCategory(categoryAdapter, auditAdapter).execute(
        ExerciseCategoryController.parseId(req),
        req.body,
        req.user!.userId
      );
      return res.status(200).json(category);
    } catch (error) {
      return ExerciseCategoryController.handleError(error, res);
    }
  }

  static async remove(req: AuthRequest, res: Response) {
    try {
      await new DeactivateExerciseCategory(categoryAdapter, auditAdapter).execute(
        ExerciseCategoryController.parseId(req),
        req.user!.userId
      );
      return res.status(200).json({ message: "Categoría inactivada correctamente" });
    } catch (error) {
      return ExerciseCategoryController.handleError(error, res);
    }
  }

  private static parseId(req: AuthRequest): number {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError("El id debe ser un número válido", 400);
    }
    return id;
  }

  private static handleError(error: unknown, res: Response) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
