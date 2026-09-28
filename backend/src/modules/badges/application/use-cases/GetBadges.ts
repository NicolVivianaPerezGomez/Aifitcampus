// Listar insignias
import { BadgePort } from "../../domain/ports/BadgePort";
import { Badge } from "../../domain/entities/Badge";

export class GetBadges {
  constructor(private badgePort: BadgePort) {}

  async execute(onlyActive: boolean): Promise<Badge[]> {
    return this.badgePort.findAll(onlyActive);
  }
}
