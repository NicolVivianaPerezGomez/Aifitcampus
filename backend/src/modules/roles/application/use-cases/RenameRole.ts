// HU-07 Edición de rol — el diagrama aprobado no tiene columna de permisos en
// `roles`, así que lo único editable a nivel de rol es su nombre. La
// personalización de accesos se resuelve a nivel de usuario (users.permissions).
import { RolePort } from "../../domain/ports/RolePort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { RenameRoleDto } from "../dto/RoleDto";
import { AppError } from "../../../../shared/utils/AppError";
import { Role } from "../../domain/entities/Role";

export class RenameRole {
  constructor(private rolePort: RolePort, private auditPort: AuditPort) {}

  async execute(roleId: number, dto: RenameRoleDto, actorUserId: number): Promise<Role> {
    const role = await this.rolePort.findById(roleId);
    if (!role) {
      throw new AppError("Rol no encontrado", 404);
    }

    if (dto.name !== role.name) {
      const duplicated = await this.rolePort.findByName(dto.name);
      if (duplicated) {
        throw new AppError("Ya existe un rol con ese nombre", 409);
      }
    }

    const updated = await this.rolePort.rename(roleId, dto.name);

    // CA-02 Registro de auditoría: quién y cuándo modificó el rol
    await this.auditPort.register({
      userId: actorUserId,
      action: "UPDATE",
      entity: "roles",
      description: `Rol renombrado de "${role.name}" a "${dto.name}" (id ${roleId})`,
    });

    return updated as Role;
  }
}
