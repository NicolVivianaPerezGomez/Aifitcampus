// HU-09 Asignación de rol a usuario (users.role_id ya existe en el diagrama)
import { RolePort } from "../../domain/ports/RolePort";
import { UserPort } from "../../../users/domain/ports/UserPort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { AppError } from "../../../../shared/utils/AppError";

export class AssignRoleToUser {
  constructor(
    private rolePort: RolePort,
    private userPort: UserPort,
    private auditPort: AuditPort
  ) {}

  async execute(userId: number, roleId: number, actorUserId: number): Promise<void> {
    const user = await this.userPort.getUserById(userId);
    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    const role = await this.rolePort.findById(roleId);
    if (!role) {
      throw new AppError("El rol no existe", 404);
    }

    await this.userPort.updateUser(userId, { roleId });

    await this.auditPort.register({
      userId: actorUserId,
      action: "UPDATE",
      entity: "users",
      description: `Usuario ${userId} reasignado al rol ${role.name} (id ${roleId})`,
    });
  }
}
