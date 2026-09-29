// HU-06 Creación de roles
import { RolePort } from "../../domain/ports/RolePort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { CreateRoleDto } from "../dto/RoleDto";
import { AppError } from "../../../../shared/utils/AppError";
import { Role } from "../../domain/entities/Role";

export class CreateRole {
  constructor(private rolePort: RolePort, private auditPort: AuditPort) {}

  async execute(dto: CreateRoleDto, actorUserId: number): Promise<Role> {
    // CA-02 Nombre de rol duplicado
    const existing = await this.rolePort.findByName(dto.name);
    if (existing) {
      throw new AppError("Ya existe un rol con ese nombre", 409);
    }

    const role = await this.rolePort.create({ name: dto.name });

    await this.auditPort.register({
      userId: actorUserId,
      action: "CREATE",
      entity: "roles",
      description: `Rol creado: ${role.name}`,
    });

    // Nota HU-06: la definición de "módulos/permisos" del rol no se persiste
    // aquí porque la tabla roles del diagrama aprobado solo tiene id y name.
    // Los permisos finos se manejan por usuario vía users.permissions
    // (endpoint PATCH /users/:id/permissions).
    return role;
  }
}
