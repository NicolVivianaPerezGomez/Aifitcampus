import { Repository } from "typeorm";
import { AppDataSource } from "../../../../shared/config/data-base";
import { AuditModel } from "../persistence/AuditModel";
import { AuditPort, AuditFilter } from "../../domain/ports/AuditPort";
import { Audit } from "../../domain/entities/Audit";

export class AuditAdapter implements AuditPort {
  private repo: Repository<AuditModel>;

  constructor() {
    this.repo = AppDataSource.getRepository(AuditModel);
  }

  private toDomain(model: AuditModel): Audit {
    return {
      id: model.id,
      userId: model.user?.id ?? null,
      action: model.action,
      entity: model.entity,
      description: model.description,
      createdAt: model.createdAt,
    };
  }

  async register(entry: Omit<Audit, "id" | "createdAt">): Promise<void> {
    await this.repo.insert({
      ...(entry.userId !== null ? { user: { id: entry.userId } } : {}),
      action: entry.action,
      entity: entry.entity,
      description: entry.description,
    });
  }

  async findAll(filter: AuditFilter): Promise<Audit[]> {
    const qb = this.repo.createQueryBuilder("a").leftJoinAndSelect("a.user", "u");

    if (filter.userId) qb.andWhere("u.id = :userId", { userId: filter.userId });
    if (filter.entity) qb.andWhere("a.entity = :entity", { entity: filter.entity });
    if (filter.action) qb.andWhere("a.action = :action", { action: filter.action });

    qb.orderBy("a.createdAt", "DESC");

    if (filter.limit) qb.take(filter.limit);
    if (filter.offset) qb.skip(filter.offset);

    const found = await qb.getMany();
    return found.map((m) => this.toDomain(m));
  }

  async findById(id: number): Promise<Audit | null> {
    const found = await this.repo.findOne({
      where: { id },
      relations: ["user"],
    });
    return found ? this.toDomain(found) : null;
  }
}
