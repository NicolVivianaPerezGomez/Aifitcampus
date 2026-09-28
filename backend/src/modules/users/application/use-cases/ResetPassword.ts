// Restablecer contraseña de un usuario (solo admin)
import bcrypt from "bcrypt";
import { UserPort } from "../../domain/ports/UserPort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { AppError } from "../../../../shared/utils/AppError";

export class ResetPassword {
  constructor(private userPort: UserPort, private auditPort: AuditPort) {}

  async execute(userId: number, newPassword: string, actorUserId: number): Promise<void> {
    const user = await this.userPort.getUserById(userId);
    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userPort.updateUser(userId, { password: hashedPassword });

    await this.auditPort.register({
      userId: actorUserId,
      action: "RESET_PASSWORD",
      entity: "users",
      description: `Contraseña restablecida para: ${user.email} (id ${userId})`,
    });
  }
}
