import { Response } from "express";
import { AuthRequest } from "../../../../shared/middleware/auth.middleware";
import { AppError } from "../../../../shared/utils/AppError";

import { RoutineTypeAdapter } from "../adapters/RoutineTypeAdapter";
import { AuditAdapter } from "../../../audits/infrastructure/adapters/AuditAdapter";

import { CreateRoutineType } from "../../application/use-cases/CreateRoutineType";
import { GetRoutineTypes } from "../../application/use-cases/GetRoutineTypes";
import { UpdateRoutineType } from "../../application/use-cases/UpdateRoutineType";
import { DeactivateRoutineType } from "../../application/use-cases/DeactivateRoutineType";
import { RoutineTypeFilter } from "../../domain/ports/RoutineTypePort";

const routineTypeAdapter = new RoutineTypeAdapter();
const auditAdapter = new AuditAdapter();

export class RoutineTypeController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const routineType = await new CreateRoutineType(routineTypeAdapter, auditAdapter).execute(
        req.body,
        req.user!.userId
      );
      return res.status(201).json(routineType);
    } catch (error) {
      return RoutineTypeController.handleError(error, res);
    }
  }

  // GET /routine-types?search=oficina&active=true
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const filter: RoutineTypeFilter = { onlyActive: req.query.active === "true" };
      if (typeof req.query.search === "string") filter.search = req.query.search;
      const types = await new GetRoutineTypes(routineTypeAdapter).execute(filter);
      return res.status(200).json(types);
    } catch (error) {
      return RoutineTypeController.handleError(error, res);
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const routineType = await new UpdateRoutineType(routineTypeAdapter, auditAdapter).execute(
        RoutineTypeController.parseId(req),
        req.body,
        req.user!.userId
      );
      return res.status(200).json(routineType);
    } catch (error) {
      return RoutineTypeController.handleError(error, res);
    }
  }

  static async remove(req: AuthRequest, res: Response) {
    try {
      await new DeactivateRoutineType(routineTypeAdapter, auditAdapter).execute(
        RoutineTypeController.parseId(req),
        req.user!.userId
      );
      return res.status(200).json({ message: "Tipo de rutina inactivado correctamente" });
    } catch (error) {
      return RoutineTypeController.handleError(error, res);
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
