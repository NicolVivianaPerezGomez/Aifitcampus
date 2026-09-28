// Devuelve el usuario de la sesión actual (el del token), con su rol.
// Lo usa el frontend después del login con Microsoft para saber quién entró.
import { UserPort } from "../../domain/ports/UserPort";
import { User, ACCOUNT_STATUS } from "../../domain/entities/User";
import { AppError } from "../../../../shared/utils/AppError";

export class GetCurrentUser {
  constructor(private userPort: UserPort) {}

  async execute(userId: number): Promise<User> {
    const user = await this.userPort.getUserById(userId);
    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }
    if (user.statusId !== ACCOUNT_STATUS.ACTIVE) {
      throw new AppError("La cuenta se encuentra inactiva", 403);
    }
    return user;
  }
}
