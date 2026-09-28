import { Response } from "express";
import { AuthRequest } from "../../../../shared/middleware/auth.middleware";
import { AppError } from "../../../../shared/utils/AppError";

import { ExerciseAdapter } from "../adapters/ExerciseAdapter";
import { ExerciseCategoryAdapter } from "../adapters/ExerciseCategoryAdapter";
import { AuditAdapter } from "../../../audits/infrastructure/adapters/AuditAdapter";

import { CreateExercise } from "../../application/use-cases/CreateExercise";
import { GetExercises } from "../../application/use-cases/GetExercises";
import { GetExerciseById } from "../../application/use-cases/GetExerciseById";
import { UpdateExercise } from "../../application/use-cases/UpdateExercise";
import { DeactivateExercise } from "../../application/use-cases/DeactivateExercise";
import { ExerciseFilter } from "../../domain/ports/ExercisePort";

const exerciseAdapter = new ExerciseAdapter();
const categoryAdapter = new ExerciseCategoryAdapter();
const auditAdapter = new AuditAdapter();

export class ExerciseController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const exercise = await new CreateExercise(exerciseAdapter, categoryAdapter, auditAdapter).execute(
        req.body,
        req.user!.userId
      );
      return res.status(201).json(exercise);
    } catch (error) {
      return ExerciseController.handleError(error, res);
    }
  }

  // GET /exercises?search=cuello&categoryId=1&active=true
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const filter: ExerciseFilter = { onlyActive: req.query.active === "true" };
      if (typeof req.query.search === "string") filter.search = req.query.search;
      if (req.query.categoryId) filter.categoryId = Number(req.query.categoryId);
      const exercises = await new GetExercises(exerciseAdapter).execute(filter);
      return res.status(200).json(exercises);
    } catch (error) {
      return ExerciseController.handleError(error, res);
    }
  }

  static async getById(req: AuthRequest, res: Response) {
    try {
      const exercise = await new GetExerciseById(exerciseAdapter).execute(ExerciseController.parseId(req));
      return res.status(200).json(exercise);
    } catch (error) {
      return ExerciseController.handleError(error, res);
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const exercise = await new UpdateExercise(exerciseAdapter, categoryAdapter, auditAdapter).execute(
        ExerciseController.parseId(req),
        req.body,
        req.user!.userId
      );
      return res.status(200).json(exercise);
    } catch (error) {
      return ExerciseController.handleError(error, res);
    }
  }

  static async remove(req: AuthRequest, res: Response) {
    try {
      await new DeactivateExercise(exerciseAdapter, auditAdapter).execute(
        ExerciseController.parseId(req),
        req.user!.userId
      );
      return res.status(200).json({ message: "Ejercicio inactivado correctamente" });
    } catch (error) {
      return ExerciseController.handleError(error, res);
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
