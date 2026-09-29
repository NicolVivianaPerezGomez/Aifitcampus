import { Response } from "express";
import { AuthRequest } from "../../../../shared/middleware/auth.middleware";
import { AppError } from "../../../../shared/utils/AppError";

import { RoutineAdapter } from "../adapters/RoutineAdapter";
import { RoutineTypeAdapter } from "../adapters/RoutineTypeAdapter";
import { RoutineLogAdapter } from "../adapters/RoutineLogAdapter";
import { ExerciseAdapter } from "../../../exercises/infrastructure/adapters/ExerciseAdapter";
import { AuditAdapter } from "../../../audits/infrastructure/adapters/AuditAdapter";

import { CreateRoutine } from "../../application/use-cases/CreateRoutine";
import { GetRoutines } from "../../application/use-cases/GetRoutines";
import { GetRoutineById } from "../../application/use-cases/GetRoutineById";
import { UpdateRoutine } from "../../application/use-cases/UpdateRoutine";
import { DeactivateRoutine } from "../../application/use-cases/DeactivateRoutine";
import { LogRoutineExecution } from "../../application/use-cases/LogRoutineExecution";
import { GetRoutineHistory } from "../../application/use-cases/GetRoutineHistory";
import { RoutineFilter } from "../../domain/ports/RoutinePort";

const routineAdapter = new RoutineAdapter();
const routineTypeAdapter = new RoutineTypeAdapter();
const routineLogAdapter = new RoutineLogAdapter();
const exerciseAdapter = new ExerciseAdapter();
const auditAdapter = new AuditAdapter();

export class RoutineController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const routine = await new CreateRoutine(routineAdapter, routineTypeAdapter, exerciseAdapter, auditAdapter).execute(
        req.body,
        req.user!.userId
      );
      return res.status(201).json(routine);
    } catch (error) {
      return RoutineController.handleError(error, res);
    }
  }

  // GET /routines?search=cuello&routineTypeId=1&active=true
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const filter: RoutineFilter = { onlyActive: req.query.active === "true" };
      if (typeof req.query.search === "string") filter.search = req.query.search;
      if (req.query.routineTypeId) filter.routineTypeId = Number(req.query.routineTypeId);
      const routines = await new GetRoutines(routineAdapter).execute(filter);
      return res.status(200).json(routines);
    } catch (error) {
      return RoutineController.handleError(error, res);
    }
  }

  static async getById(req: AuthRequest, res: Response) {
    try {
      const routine = await new GetRoutineById(routineAdapter).execute(RoutineController.parseId(req));
      return res.status(200).json(routine);
    } catch (error) {
      return RoutineController.handleError(error, res);
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const routine = await new UpdateRoutine(routineAdapter, routineTypeAdapter, exerciseAdapter, auditAdapter).execute(
        RoutineController.parseId(req),
        req.body,
        req.user!.userId
      );
      return res.status(200).json(routine);
    } catch (error) {
      return RoutineController.handleError(error, res);
    }
  }

  // DELETE /routines/:id?confirm=true
  static async remove(req: AuthRequest, res: Response) {
    try {
      await new DeactivateRoutine(routineAdapter, auditAdapter).execute(
        RoutineController.parseId(req),
        req.query.confirm === "true",
        req.user!.userId
      );
      return res.status(200).json({ message: "Rutina inactivada correctamente" });
    } catch (error) {
      return RoutineController.handleError(error, res);
    }
  }

  // POST /routines/:id/execute  -> el usuario de la sesión hizo la rutina
  static async execute(req: AuthRequest, res: Response) {
    try {
      const log = await new LogRoutineExecution(routineAdapter, routineLogAdapter, auditAdapter).execute(
        RoutineController.parseId(req),
        req.body,
        req.user!.userId
      );
      return res.status(201).json(log);
    } catch (error) {
      return RoutineController.handleError(error, res);
    }
  }

  // GET /routines/history/me  -> historial del usuario de la sesión
  static async history(req: AuthRequest, res: Response) {
    try {
      const logs = await new GetRoutineHistory(routineLogAdapter).execute(req.user!.userId);
      return res.status(200).json(logs);
    } catch (error) {
      return RoutineController.handleError(error, res);
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
