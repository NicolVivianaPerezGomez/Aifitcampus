import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt.util";
import { AppDataSource } from "../config/data-base";
import { UserModel } from "../../modules/users/infrastructure/persistence/UserModel";
import { ACCOUNT_STATUS } from "../../modules/users/domain/entities/User";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }
  const token = header.split(" ")[1];
  try {
    const payload = verifyToken(token as string);

    // Validar que el usuario exista y esté activo en la BD
    const user = await AppDataSource.getRepository(UserModel).findOne({
      where: { id: payload.userId },
      relations: { role: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    if (user.statusId !== ACCOUNT_STATUS.ACTIVE) {
      return res.status(401).json({ message: "La cuenta se encuentra inactiva" });
    }

    // Validar que el usuario tenga un rol asignado
    if (!user.role) {
      return res.status(401).json({ message: "El usuario no tiene un rol asignado" });
    }

    req.user = payload;
    next();
  } catch (error) {
    console.error("[AuthMiddleware] Token inválido o expirado:", error);
    return res.status(401).json({ message: "Token inválido o expirado, inicie sesión nuevamente" });
  }
};
