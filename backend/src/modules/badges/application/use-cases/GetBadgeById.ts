// Ver el detalle de una insignia
import { BadgePort } from "../../domain/ports/BadgePort";
import { Badge } from "../../domain/entities/Badge";
import { AppError } from "../../../../shared/utils/AppError";

export class GetBadgeById {
  constructor(private badgePort: BadgePort) {}

  async execute(id: number): Promise<Badge> {
    const badge = await this.badgePort.findById(id);
    if (!badge) {
      throw new AppError("Insignia no encontrada", 404);
    }
    return badge;
  }
}
