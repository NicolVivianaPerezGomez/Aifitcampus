// HU-08 "Inactivación" de roles. El diagrama aprobado no tiene columna is_active
// en `roles`, por lo que no existe un estado "inactivo" persistible: la única
// forma de retirar un rol del catálogo es eliminarlo. La regla de negocio de
// HU-08 (no permitir la baja si tiene usuarios asociados) se conserva igual,
// y además queda reforzada por la FK users.role_id -> roles.id.
import { RolePort } from "../../domain/ports/RolePort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { AppError } from "../../../../shared/utils/AppError";

export class DeleteRole {
  constructor(private rolePort: RolePort, private auditPort: AuditPort) {}

  async execute(roleId: number, actorUserId: number): Promise<void> {
    const role = await this.rolePort.findById(roleId);
    if (!role) {
      throw new AppError("Rol no encontrado", 404);
    }

    // CA-02 Intento de inactivar (eliminar) un rol en uso
    const usersCount = await this.rolePort.countUsersByRole(roleId);
    if (usersCount > 0) {
      throw new AppError(
        `No es posible eliminar el rol: tiene ${usersCount} usuario(s) asociado(s)`,
        409
      );
    }

    await this.rolePort.remove(roleId);

    await this.auditPort.register({
      userId: actorUserId,
      action: "DELETE",
      entity: "roles",
      description: `Rol eliminado: ${role.name} (id ${roleId})`,
    });
  }
}
