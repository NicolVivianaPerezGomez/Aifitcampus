import { Repository } from "typeorm";
import { withoutUndefined, isEmpty } from "../../../../shared/utils/persistence.util";
import { AppDataSource } from "../../../../shared/config/data-base";
import { BadgeModel } from "../persistence/BadgeModel";
import { Badge } from "../../domain/entities/Badge";
import { BadgePort } from "../../domain/ports/BadgePort";

// Adaptador: conecta el dominio (Badge) con la base de datos (BadgeModel).
export class BadgeAdapter implements BadgePort {
  private repo: Repository<BadgeModel>;

  constructor() {
    this.repo = AppDataSource.getRepository(BadgeModel);
  }

  // BadgeModel (BD) -> Badge (dominio)
  private toDomain(model: BadgeModel): Badge {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      condition: model.condition,
      targetValue: model.targetValue,
      isActive: model.isActive !== false,
    };
  }

  async create(badge: Partial<Badge>): Promise<Badge> {
    const result = await this.repo.insert(withoutUndefined(badge) as never);
    return (await this.findById(result.identifiers[0]!.id)) as Badge;
  }

  async update(id: number, badge: Partial<Badge>): Promise<Badge | null> {
    const changes = withoutUndefined(badge);
    if (!isEmpty(changes)) await this.repo.update(id, changes as never);
    return this.findById(id);
  }

  async findById(id: number): Promise<Badge | null> {
    const found = await this.repo.findOneBy({ id });
    return found ? this.toDomain(found) : null;
  }

  // Compara sin importar mayúsculas
  async findByName(name: string): Promise<Badge | null> {
    const found = await this.repo
      .createQueryBuilder("b")
      .where("LOWER(b.name) = LOWER(:name)", { name })
      .getOne();
    return found ? this.toDomain(found) : null;
  }

  async findAll(onlyActive: boolean): Promise<Badge[]> {
    const found = await this.repo.find({
      where: onlyActive ? { isActive: true } : {},
      order: { name: "ASC" },
    });
    return found.map((m) => this.toDomain(m));
  }
}
