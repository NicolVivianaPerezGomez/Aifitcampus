// HU-13 Asociación/reasignación de área de un usuario, sobre users.department
// (no existe tabla areas en el diagrama; se va trabajar con el campo real)
import { UserPort } from "../../domain/ports/UserPort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { AssignDepartmentDto } from "../dto/AssignDepartmentDto";
import { AppError } from "../../../../shared/utils/AppError";

export class AssignDepartment {
  constructor(private userPort: UserPort, private auditPort: AuditPort) {}

  async execute(userId: number, dto: AssignDepartmentDto, actorUserId: number): Promise<void> {
    const user = await this.userPort.getUserById(userId);
    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    await this.userPort.updateUser(userId, {
      department: dto.department,
      ...(dto.officeLocation ? { officeLocation: dto.officeLocation } : {}),
    });

    await this.auditPort.register({
      userId: actorUserId,
      action: "UPDATE",
      entity: "users",
      description: `Área/departamento de usuario ${userId} actualizado a "${dto.department}"`,
    });
  }
}
