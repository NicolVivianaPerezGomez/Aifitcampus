import { Response } from "express";
import { AuthRequest } from "../../../../shared/middleware/auth.middleware";
import { AppError } from "../../../../shared/utils/AppError";

import { BadgeAdapter } from "../adapters/BadgeAdapter";
import { AuditAdapter } from "../../../audits/infrastructure/adapters/AuditAdapter";

import { CreateBadge } from "../../application/use-cases/CreateBadge";
import { GetBadges } from "../../application/use-cases/GetBadges";
import { GetBadgeById } from "../../application/use-cases/GetBadgeById";
import { UpdateBadge } from "../../application/use-cases/UpdateBadge";
import { DeactivateBadge } from "../../application/use-cases/DeactivateBadge";

const badgeAdapter = new BadgeAdapter();
const auditAdapter = new AuditAdapter();

export class BadgeController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const badge = await new CreateBadge(badgeAdapter, auditAdapter).execute(req.body, req.user!.userId);
      return res.status(201).json(badge);
    } catch (error) {
      return BadgeController.handleError(error, res);
    }
  }

  // GET /badges?active=true
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const badges = await new GetBadges(badgeAdapter).execute(req.query.active === "true");
      return res.status(200).json(badges);
    } catch (error) {
      return BadgeController.handleError(error, res);
    }
  }

  static async getById(req: AuthRequest, res: Response) {
    try {
      const badge = await new GetBadgeById(badgeAdapter).execute(BadgeController.parseId(req));
      return res.status(200).json(badge);
    } catch (error) {
      return BadgeController.handleError(error, res);
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const badge = await new UpdateBadge(badgeAdapter, auditAdapter).execute(
        BadgeController.parseId(req),
        req.body,
        req.user!.userId
      );
      return res.status(200).json(badge);
    } catch (error) {
      return BadgeController.handleError(error, res);
    }
  }

  static async remove(req: AuthRequest, res: Response) {
    try {
      await new DeactivateBadge(badgeAdapter, auditAdapter).execute(BadgeController.parseId(req), req.user!.userId);
      return res.status(200).json({ message: "Insignia inactivada correctamente" });
    } catch (error) {
      return BadgeController.handleError(error, res);
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
