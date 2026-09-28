// Login local con correo y contraseña (validado contra la BD)
import bcrypt from "bcrypt";
import { UserPort } from "../../domain/ports/UserPort";
import { LoginResult } from "../dto/LoginResultDto";
import { signToken } from "../../../../shared/utils/jwt.util";
import { AppError } from "../../../../shared/utils/AppError";
import { ACCOUNT_STATUS } from "../../domain/entities/User";

export class LoginLocal {
  constructor(private userPort: UserPort, private allowedEmailDomain?: string) {}

  async execute(email: string, password: string): Promise<LoginResult> {
    // Validar dominio institucional
    if (
      this.allowedEmailDomain &&
      !email.toLowerCase().endsWith(`@${this.allowedEmailDomain.toLowerCase()}`)
    ) {
      throw new AppError(`El correo debe pertenecer al dominio institucional @${this.allowedEmailDomain}`, 403);
    }

    // Buscar usuario por correo
    const user = await this.userPort.getUserByEmail(email.toLowerCase());
    if (!user) {
      throw new AppError("Credenciales inválidas", 401);
    }

    // Validar que el usuario tenga contraseña asignada
    if (!user.password) {
      throw new AppError("El usuario no tiene contraseña asignada. Contacta al administrador.", 403);
    }

    // Validar contraseña
    const passwordValida = await bcrypt.compare(password, user.password);
    if (!passwordValida) {
      throw new AppError("Credenciales inválidas", 401);
    }

    // Validar que el usuario esté activo
    if (user.statusId !== ACCOUNT_STATUS.ACTIVE) {
      throw new AppError("La cuenta se encuentra inactiva", 403);
    }

    // Validar que el usuario tenga rol asignado
    if (!user.roleId) {
      throw new AppError("El usuario no tiene un rol asignado. Contacta al administrador.", 403);
    }

    const token = signToken({ userId: user.id, email: user.email, roleId: user.roleId });

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
      },
    };
  }
}
