import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { AppDataSource } from "../config/data-base";
import { UserModel } from "../../modules/users/infrastructure/persistence/UserModel";

/**
 * Middleware que verifica que el usuario autenticado tenga rol de administrador.
 * Debe usarse DESPUÉS de authMiddleware.
 */
export const adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const user = await AppDataSource.getRepository(UserModel).findOne({
      where: { id: req.user.userId },
      relations: { role: true },
    });

    if (!user || !user.role) {
      return res.status(403).json({ message: "No tiene permisos de administrador" });
    }

    // El rol de admin se identifica por nombre (insensible a mayúsculas)
    const roleName = user.role.name.toLowerCase();
    if (roleName !== "admin" && roleName !== "administrador") {
      return res.status(403).json({ message: "No tiene permisos de administrador" });
    }

    next();
  } catch (error) {
    console.error("[AdminMiddleware] Error:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
