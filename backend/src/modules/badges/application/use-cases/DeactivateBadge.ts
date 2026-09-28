// "Eliminar" insignia: se inactiva (is_active = false) para conservar
// las insignias que los usuarios ya ganaron (user_badges).
import { BadgePort } from "../../domain/ports/BadgePort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { AppError } from "../../../../shared/utils/AppError";

export class DeactivateBadge {
  constructor(private badgePort: BadgePort, private auditPort: AuditPort) {}

  async execute(id: number, actorUserId: number): Promise<void> {
    const badge = await this.badgePort.findById(id);
    if (!badge) {
      throw new AppError("Insignia no encontrada", 404);
    }
    if (badge.isActive === false) {
      throw new AppError("La insignia ya está inactiva", 409);
    }

    await this.badgePort.update(id, { isActive: false });

    await this.auditPort.register({
      userId: actorUserId,
      action: "DELETE",
      entity: "badges",
      description: `Insignia inactivada: ${badge.name} (id ${id})`,
    });
  }
}
