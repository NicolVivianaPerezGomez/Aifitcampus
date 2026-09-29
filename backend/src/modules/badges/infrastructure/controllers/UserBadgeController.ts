import { Response } from "express";
import { AuthRequest } from "../../../../shared/middleware/auth.middleware";
import { AppError } from "../../../../shared/utils/AppError";

import { UserBadgeAdapter } from "../adapters/UserBadgeAdapter";
import { BadgeAdapter } from "../adapters/BadgeAdapter";
import { AuditAdapter } from "../../../audits/infrastructure/adapters/AuditAdapter";

import { GetUserBadges } from "../../application/use-cases/GetUserBadges";
import { AssignBadge } from "../../application/use-cases/AssignBadge";
import { RemoveUserBadge } from "../../application/use-cases/RemoveUserBadge";

const userBadgeAdapter = new UserBadgeAdapter();
const badgeAdapter = new BadgeAdapter();
const auditAdapter = new AuditAdapter();

export class UserBadgeController {
  // GET /user-badges/user/:userId
  static async getByUser(req: AuthRequest, res: Response) {
    try {
      const userId = UserBadgeController.parseId(req);
      const badges = await new GetUserBadges(userBadgeAdapter).execute(userId);
      return res.status(200).json(badges);
    } catch (error) {
      return UserBadgeController.handleError(error, res);
    }
  }

  // POST /user-badges
  static async assign(req: AuthRequest, res: Response) {
    try {
      const { userId, badgeId, progress } = req.body;
      if (!userId || !badgeId) {
        throw new AppError("userId y badgeId son requeridos", 400);
      }
      const userBadge = await new AssignBadge(userBadgeAdapter, badgeAdapter, auditAdapter).execute(
        Number(userId),
        Number(badgeId),
        progress !== undefined ? Number(progress) : undefined,
        req.user!.userId
      );
      return res.status(201).json(userBadge);
    } catch (error) {
      return UserBadgeController.handleError(error, res);
    }
  }

  // DELETE /user-badges/:id
  static async remove(req: AuthRequest, res: Response) {
    try {
      const id = UserBadgeController.parseId(req);
      await new RemoveUserBadge(userBadgeAdapter, auditAdapter).execute(id, req.user!.userId);
      return res.status(200).json({ message: "Insignia removida correctamente" });
    } catch (error) {
      return UserBadgeController.handleError(error, res);
    }
  }

  private static parseId(req: AuthRequest): number {
    const id = Number(req.params.id || req.params.userId);
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
