import { Repository } from "typeorm";
import { withoutUndefined, isEmpty } from "../../../../shared/utils/persistence.util";
import { AppDataSource } from "../../../../shared/config/data-base";
import { RoutineTypeModel } from "../persistence/RoutineTypeModel";
import { RoutineModel } from "../persistence/RoutineModel";
import { RoutineType } from "../../domain/entities/RoutineType";
import { RoutineTypeFilter, RoutineTypePort } from "../../domain/ports/RoutineTypePort";

// Adaptador: conecta el dominio (RoutineType) con la base de datos (RoutineTypeModel).
export class RoutineTypeAdapter implements RoutineTypePort {
  private repo: Repository<RoutineTypeModel>;
  private routineRepo: Repository<RoutineModel>;

  constructor() {
    this.repo = AppDataSource.getRepository(RoutineTypeModel);
    this.routineRepo = AppDataSource.getRepository(RoutineModel);
  }

  // RoutineTypeModel (BD) -> RoutineType (dominio)
  private toDomain(model: RoutineTypeModel): RoutineType {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      isActive: model.isActive !== false,
    };
  }

  async create(routineType: Partial<RoutineType>): Promise<RoutineType> {
    const result = await this.repo.insert(withoutUndefined(routineType) as never);
    return (await this.findById(result.identifiers[0]!.id)) as RoutineType;
  }

  async update(id: number, routineType: Partial<RoutineType>): Promise<RoutineType | null> {
    const changes = withoutUndefined(routineType);
    if (!isEmpty(changes)) await this.repo.update(id, changes as never);
    return this.findById(id);
  }

  async findById(id: number): Promise<RoutineType | null> {
    const found = await this.repo.findOneBy({ id });
    return found ? this.toDomain(found) : null;
  }

  // Compara sin importar mayúsculas
  async findByName(name: string): Promise<RoutineType | null> {
    const found = await this.repo
      .createQueryBuilder("t")
      .where("LOWER(t.name) = LOWER(:name)", { name: name.trim() })
      .getOne();
    return found ? this.toDomain(found) : null;
  }

  async findAll(filter: RoutineTypeFilter): Promise<RoutineType[]> {
    const qb = this.repo.createQueryBuilder("t").orderBy("t.name", "ASC");
    if (filter.search) {
      qb.andWhere("(t.name ILIKE :s OR t.description ILIKE :s)", { s: `%${filter.search}%` });
    }
    if (filter.onlyActive) {
      qb.andWhere("t.is_active = true");
    }
    const found = await qb.getMany();
    return found.map((m) => this.toDomain(m));
  }

  async countActiveRoutines(routineTypeId: number): Promise<number> {
    return this.routineRepo.count({ where: { routineType: { id: routineTypeId }, isActive: true } });
  }
}
