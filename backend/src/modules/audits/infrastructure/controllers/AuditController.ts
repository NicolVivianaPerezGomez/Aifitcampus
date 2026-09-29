import { Response } from "express";
import { AuthRequest } from "../../../../shared/middleware/auth.middleware";
import { AppError } from "../../../../shared/utils/AppError";

import { AuditAdapter } from "../adapters/AuditAdapter";
import { GetAudits } from "../../application/use-cases/GetAudits";
import { GetAuditById } from "../../application/use-cases/GetAuditById";
import { AuditFilter } from "../../domain/ports/AuditPort";

const auditAdapter = new AuditAdapter();

export class AuditController {
  // GET /audits?userId=&entity=&action=&limit=&offset=
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const filter: AuditFilter = {};
      if (req.query.userId) filter.userId = Number(req.query.userId);
      if (req.query.entity) filter.entity = String(req.query.entity);
      if (req.query.action) filter.action = String(req.query.action);
      if (req.query.limit) filter.limit = Number(req.query.limit);
      if (req.query.offset) filter.offset = Number(req.query.offset);

      const audits = await new GetAudits(auditAdapter).execute(filter);
      return res.status(200).json(audits);
    } catch (error) {
      return AuditController.handleError(error, res);
    }
  }

  // GET /audits/:id
  static async getById(req: AuthRequest, res: Response) {
    try {
      const id = AuditController.parseId(req);
      const audit = await new GetAuditById(auditAdapter).execute(id);
      return res.status(200).json(audit);
    } catch (error) {
      return AuditController.handleError(error, res);
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
