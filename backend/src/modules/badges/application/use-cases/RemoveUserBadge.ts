import { UserBadgePort } from "../../domain/ports/UserBadgePort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { AppError } from "../../../../shared/utils/AppError";

export class RemoveUserBadge {
  constructor(
    private readonly userBadgePort: UserBadgePort,
    private readonly auditPort: AuditPort
  ) {}

  async execute(id: number, actorUserId: number): Promise<void> {
    const userBadge = await this.userBadgePort.findById(id);
    if (!userBadge) {
      throw new AppError("La asignación de insignia no existe", 404);
    }

    await this.userBadgePort.remove(id);

    await this.auditPort.register({
      userId: actorUserId,
      action: "REMOVE",
      entity: "user_badges",
      description: `Insignia ${userBadge.badgeId} removida del usuario ${userBadge.userId}`,
    });
  }
}
