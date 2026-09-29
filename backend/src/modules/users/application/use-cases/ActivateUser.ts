// Reactivación de un usuario previamente inactivado
import { UserPort } from "../../domain/ports/UserPort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { AppError } from "../../../../shared/utils/AppError";

export class ActivateUser {
  constructor(private userPort: UserPort, private auditPort: AuditPort) {}

  async execute(userId: number, actorUserId: number): Promise<void> {
    const user = await this.userPort.getUserById(userId);
    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }
    await this.userPort.activateUser(userId); // solo cambia status_id, no borra historial
    await this.auditPort.register({
      userId: actorUserId,
      action: "ACTIVATE",
      entity: "users",
      description: `Usuario reactivado: ${user.email} (id ${userId})`,
    });
  }
}
