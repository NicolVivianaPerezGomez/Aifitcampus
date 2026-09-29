import { Repository } from "typeorm";
import { AppDataSource } from "../../../../shared/config/data-base";
import { UserBadgeModel } from "../persistence/UserBadgeModel";
import { UserBadge } from "../../domain/entities/UserBadge";
import { UserBadgePort } from "../../domain/ports/UserBadgePort";

export class UserBadgeAdapter implements UserBadgePort {
  private readonly repo: Repository<UserBadgeModel>;

  constructor() {
    this.repo = AppDataSource.getRepository(UserBadgeModel);
  }

  private toDomain(model: UserBadgeModel): UserBadge {
    return {
      id: model.id,
      userId: model.userId,
      badgeId: model.badgeId,
      earnedAt: model.earnedAt,
      progress: model.progress ? Number.parseFloat(model.progress) : null,
    };
  }

  async findByUser(userId: number): Promise<UserBadge[]> {
    const found = await this.repo.find({
      where: { userId },
      order: { earnedAt: "DESC" },
    });
    return found.map((m) => this.toDomain(m));
  }

  async findByBadge(badgeId: number): Promise<UserBadge[]> {
    const found = await this.repo.find({
      where: { badgeId },
      order: { earnedAt: "DESC" },
    });
    return found.map((m) => this.toDomain(m));
  }

  async findById(id: number): Promise<UserBadge | null> {
    const found = await this.repo.findOneBy({ id });
    return found ? this.toDomain(found) : null;
  }

  async assign(userId: number, badgeId: number, progress?: number): Promise<UserBadge> {
    const existing = await this.repo.findOneBy({ userId, badgeId });
    if (existing) {
      if (progress !== undefined) {
        await this.repo.update(existing.id, { progress: progress.toString() });
      }
      return (await this.findById(existing.id)) as UserBadge;
    }

    const result = await this.repo.insert({
      userId,
      badgeId,
      progress: progress !== undefined ? progress.toString() : null,
    });
    return (await this.findById(result.identifiers[0]!.id)) as UserBadge;
  }

  async updateProgress(id: number, progress: number): Promise<UserBadge | null> {
    await this.repo.update(id, { progress: progress.toString() });
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
