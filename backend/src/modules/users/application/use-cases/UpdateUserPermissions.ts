// Editar permisos específicos de un usuario, usando la columna users.permissions
// (json) que SÍ existe en el diagrama aprobado. Ver nota en RoleController: como
// la tabla roles no tiene columna de permisos, la personalización de accesos
// se maneja a nivel de usuario con este mecanismo ya soportado por el modelo.
import { UserPort } from "../../domain/ports/UserPort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { AppError } from "../../../../shared/utils/AppError";
import { User } from "../../domain/entities/User";

export class UpdateUserPermissions {
  constructor(private userPort: UserPort, private auditPort: AuditPort) {}

  async execute(userId: number, permissions: Record<string, unknown>, actorUserId: number): Promise<User> {
    const user = await this.userPort.getUserById(userId);
    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }
    const updated = await this.userPort.updateUser(userId, { permissions });
    await this.auditPort.register({
      userId: actorUserId,
      action: "UPDATE",
      entity: "users",
      description: `Permisos actualizados para el usuario ${userId}`,
    });
    return updated as User;
  }
}
