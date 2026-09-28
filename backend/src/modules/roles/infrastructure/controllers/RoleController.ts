import { Response } from "express";
import { AuthRequest } from "../../../../shared/middleware/auth.middleware";
import { AppError } from "../../../../shared/utils/AppError";

import { RoleAdapter } from "../adapters/RoleAdapter";
import { UserAdapter } from "../../../users/infrastructure/adapters/UserAdapter";
import { AuditAdapter } from "../../../audits/infrastructure/adapters/AuditAdapter";

import { CreateRole } from "../../application/use-cases/CreateRole";
import { RenameRole } from "../../application/use-cases/RenameRole";
import { DeleteRole } from "../../application/use-cases/DeleteRole";
import { AssignRoleToUser } from "../../application/use-cases/AssignRoleToUser";
import { GetRoles } from "../../application/use-cases/GetRoles";

const roleAdapter = new RoleAdapter();
const userAdapter = new UserAdapter();
const auditAdapter = new AuditAdapter();

export class RoleController {
  // HU-06
  static async create(req: AuthRequest, res: Response) {
    try {
      const role = await new CreateRole(roleAdapter, auditAdapter).execute(req.body, req.user!.userId);
      return res.status(201).json(role);
    } catch (error) {
      return RoleController.handleError(error, res);
    }
  }

  // HU-07 (limitado al nombre, ver nota en RenameRole.ts)
  static async rename(req: AuthRequest, res: Response) {
    try {
      const role = await new RenameRole(roleAdapter, auditAdapter).execute(
        Number(req.params.id),
        req.body,
        req.user!.userId
      );
      return res.status(200).json(role);
    } catch (error) {
      return RoleController.handleError(error, res);
    }
  }

  // HU-08 (eliminación protegida por uso, ver nota en DeleteRole.ts)
  static async remove(req: AuthRequest, res: Response) {
    try {
      await new DeleteRole(roleAdapter, auditAdapter).execute(Number(req.params.id), req.user!.userId);
      return res.status(200).json({ message: "Rol eliminado correctamente" });
    } catch (error) {
      return RoleController.handleError(error, res);
    }
  }

  // HU-09
  static async assignToUser(req: AuthRequest, res: Response) {
    try {
      await new AssignRoleToUser(roleAdapter, userAdapter, auditAdapter).execute(
        Number(req.params.userId),
        req.body.roleId,
        req.user!.userId
      );
      return res.status(200).json({ message: "Rol asignado correctamente" });
    } catch (error) {
      return RoleController.handleError(error, res);
    }
  }

  static async getAll(_req: AuthRequest, res: Response) {
    try {
      const roles = await new GetRoles(roleAdapter).execute();
      return res.status(200).json(roles);
    } catch (error) {
      return RoleController.handleError(error, res);
    }
  }

  private static handleError(error: unknown, res: Response) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
