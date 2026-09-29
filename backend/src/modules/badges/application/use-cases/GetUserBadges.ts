import { UserBadgePort } from "../../domain/ports/UserBadgePort";
import { UserBadge } from "../../domain/entities/UserBadge";

export class GetUserBadges {
  constructor(private readonly userBadgePort: UserBadgePort) {}

  async execute(userId: number): Promise<UserBadge[]> {
    return this.userBadgePort.findByUser(userId);
  }
}
