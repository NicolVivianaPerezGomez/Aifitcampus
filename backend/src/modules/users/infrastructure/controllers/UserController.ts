import { Request, Response } from "express";
import { AuthRequest } from "../../../../shared/middleware/auth.middleware";
import { AppError } from "../../../../shared/utils/AppError";
import envs from "../../../../shared/config/environment-vars";

import { UserAdapter } from "../adapters/UserAdapter";
import { AuditAdapter } from "../../../audits/infrastructure/adapters/AuditAdapter";

import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { UpdateProfile } from "../../application/use-cases/UpdateProfile";
import { SearchUsers } from "../../application/use-cases/SearchUsers";
import { DeactivateUser } from "../../application/use-cases/DeactivateUser";
import { ActivateUser } from "../../application/use-cases/ActivateUser";
import { AssignDepartment } from "../../application/use-cases/AssignDepartment";
import { UpdateUserPermissions } from "../../application/use-cases/UpdateUserPermissions";
import { GetCurrentUser } from "../../application/use-cases/GetCurrentUser";
import { ResetPassword } from "../../application/use-cases/ResetPassword";

const userAdapter = new UserAdapter();
const auditAdapter = new AuditAdapter();

export class UserController {
  // HU-01: el login en sí ocurre en MicrosoftAuthController (flujo OAuth).

  // Usuario de la sesión actual (lo pide el frontend después del login)
  static async me(req: AuthRequest, res: Response) {
    try {
      const user = await new GetCurrentUser(userAdapter).execute(req.user!.userId);
      return res.status(200).json(user);
    } catch (error) {
      return UserController.handleError(error, res);
    }
  }

  // HU-02
  static async register(req: AuthRequest, res: Response) {
    try {
      const user = await new RegisterUser(userAdapter, auditAdapter, envs.ALLOWED_EMAIL_DOMAIN).execute(
        req.body,
        req.user!.userId
      );
      // Aquí es donde EP08 (mensajería) debería notificar al usuario que su
      // acceso queda habilitado con su cuenta institucional de Microsoft 365.
      return res.status(201).json(user);
    } catch (error) {
      return UserController.handleError(error, res);
    }
  }

  // Registro público (sin autenticación) - asigna rol "usuario" automáticamente
  static async registerPublic(req: Request, res: Response) {
    try {
      const user = await new RegisterUser(userAdapter, auditAdapter, envs.ALLOWED_EMAIL_DOMAIN).execute(
        { ...req.body, roleId: 2 },
        0
      );
      return res.status(201).json(user);
    } catch (error) {
      return UserController.handleError(error, res);
    }
  }

  // HU-03
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = Number(req.params.id);
      if (req.user!.userId !== userId) {
        throw new AppError("No puede editar el perfil de otro usuario", 403);
      }
      const updated = await new UpdateProfile(userAdapter).execute(userId, req.body);
      return res.status(200).json(updated);
    } catch (error) {
      return UserController.handleError(error, res);
    }
  }

  // HU-05 CA-01
  static async search(req: AuthRequest, res: Response) {
    try {
      const filter: { search?: string; onlyActive?: boolean } = {
        onlyActive: req.query.active === "true",
      };
      if (typeof req.query.search === "string") filter.search = req.query.search;
      const users = await new SearchUsers(userAdapter).execute(filter);
      return res.status(200).json(users);
    } catch (error) {
      return UserController.handleError(error, res);
    }
  }

  // HU-05 CA-02
  static async deactivate(req: AuthRequest, res: Response) {
    try {
      await new DeactivateUser(userAdapter, auditAdapter).execute(Number(req.params.id), req.user!.userId);
      return res.status(200).json({ message: "Usuario inactivado correctamente" });
    } catch (error) {
      return UserController.handleError(error, res);
    }
  }

  // Reactivación de un usuario inactivo
  static async activate(req: AuthRequest, res: Response) {
    try {
      await new ActivateUser(userAdapter, auditAdapter).execute(Number(req.params.id), req.user!.userId);
      return res.status(200).json({ message: "Usuario reactivado correctamente" });
    } catch (error) {
      return UserController.handleError(error, res);
    }
  }

  // HU-13 (trabajando sobre users.department, ver nota en AssignDepartment.ts)
  static async assignDepartment(req: AuthRequest, res: Response) {
    try {
      await new AssignDepartment(userAdapter, auditAdapter).execute(
        Number(req.params.id),
        req.body,
        req.user!.userId
      );
      return res.status(200).json({ message: "Área/departamento actualizado correctamente" });
    } catch (error) {
      return UserController.handleError(error, res);
    }
  }

  // Complemento de HU-07 (ver nota en RoleController)
  static async updatePermissions(req: AuthRequest, res: Response) {
    try {
      const updated = await new UpdateUserPermissions(userAdapter, auditAdapter).execute(
        Number(req.params.id),
        req.body.permissions,
        req.user!.userId
      );
      return res.status(200).json(updated);
    } catch (error) {
      return UserController.handleError(error, res);
    }
  }

  // Restablecer contraseña de un usuario (solo admin)
  static async resetPassword(req: AuthRequest, res: Response) {
    try {
      await new ResetPassword(userAdapter, auditAdapter).execute(
        Number(req.params.id),
        req.body.password,
        req.user!.userId
      );
      return res.status(200).json({ message: "Contraseña restablecida correctamente" });
    } catch (error) {
      return UserController.handleError(error, res);
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
