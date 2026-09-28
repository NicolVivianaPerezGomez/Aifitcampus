// Editar insignia (también permite reactivarla con isActive: true)
import { BadgePort } from "../../domain/ports/BadgePort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { UpdateBadgeDto } from "../dto/BadgeDto";
import { Badge } from "../../domain/entities/Badge";
import { AppError } from "../../../../shared/utils/AppError";

export class UpdateBadge {
  constructor(private badgePort: BadgePort, private auditPort: AuditPort) {}

  async execute(id: number, dto: UpdateBadgeDto, actorUserId: number): Promise<Badge> {
    const badge = await this.badgePort.findById(id);
    if (!badge) {
      throw new AppError("Insignia no encontrada", 404);
    }

    if (dto.name !== undefined && dto.name !== badge.name) {
      const existing = await this.badgePort.findByName(dto.name);
      if (existing) {
        throw new AppError("Ya existe una insignia con ese nombre", 409);
      }
    }

    const changes: Partial<Badge> = {};
    if (dto.name !== undefined) changes.name = dto.name;
    if (dto.description !== undefined) changes.description = dto.description;
    if (dto.condition !== undefined) changes.condition = dto.condition;
    if (dto.targetValue !== undefined) changes.targetValue = dto.targetValue;
    if (dto.isActive !== undefined) changes.isActive = dto.isActive;

    const updated = await this.badgePort.update(id, changes);

    await this.auditPort.register({
      userId: actorUserId,
      action: "UPDATE",
      entity: "badges",
      description: `Insignia actualizada: ${badge.name} (id ${id})`,
    });

    return updated as Badge;
  }
}
