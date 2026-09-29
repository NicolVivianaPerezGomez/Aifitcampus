import { UserBadgePort } from "../../domain/ports/UserBadgePort";
import { BadgePort } from "../../domain/ports/BadgePort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { UserBadge } from "../../domain/entities/UserBadge";
import { AppError } from "../../../../shared/utils/AppError";

export class AssignBadge {
  constructor(
    private userBadgePort: UserBadgePort,
    private badgePort: BadgePort,
    private auditPort: AuditPort
  ) {}

  async execute(userId: number, badgeId: number, progress: number | undefined, actorUserId: number): Promise<UserBadge> {
    const badge = await this.badgePort.findById(badgeId);
    if (!badge) {
      throw new AppError("La insignia no existe", 404);
    }

    const userBadge = await this.userBadgePort.assign(userId, badgeId, progress);

    await this.auditPort.register({
      userId: actorUserId,
      action: "ASSIGN",
      entity: "user_badges",
      description: `Insignia "${badge.name}" asignada al usuario ${userId}`,
    });

    return userBadge;
  }
}
