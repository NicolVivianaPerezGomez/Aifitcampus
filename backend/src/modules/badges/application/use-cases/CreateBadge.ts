// Crear insignia
import { BadgePort } from "../../domain/ports/BadgePort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { CreateBadgeDto } from "../dto/BadgeDto";
import { Badge } from "../../domain/entities/Badge";
import { AppError } from "../../../../shared/utils/AppError";

export class CreateBadge {
  constructor(private badgePort: BadgePort, private auditPort: AuditPort) {}

  async execute(dto: CreateBadgeDto, actorUserId: number): Promise<Badge> {
    const existing = await this.badgePort.findByName(dto.name);
    if (existing) {
      throw new AppError("Ya existe una insignia con ese nombre", 409);
    }

    const badge = await this.badgePort.create({
      name: dto.name,
      description: dto.description ?? null,
      condition: dto.condition ?? null,
      targetValue: dto.targetValue ?? null,
      isActive: true,
    });

    await this.auditPort.register({
      userId: actorUserId,
      action: "CREATE",
      entity: "badges",
      description: `Insignia creada: ${badge.name} (id ${badge.id})`,
    });

    return badge;
  }
}
