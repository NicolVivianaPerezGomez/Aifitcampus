import { DeepPartial, In, Repository } from "typeorm";
import { withoutUndefined, isEmpty } from "../../../../shared/utils/persistence.util";
import { AppDataSource } from "../../../../shared/config/data-base";
import { ExerciseModel } from "../persistence/ExerciseModel";
import { Exercise } from "../../domain/entities/Exercise";
import { ExerciseFilter, ExercisePort } from "../../domain/ports/ExercisePort";

// Adaptador: conecta el dominio (Exercise) con la base de datos (ExerciseModel).
export class ExerciseAdapter implements ExercisePort {
  private repo: Repository<ExerciseModel>;

  constructor() {
    this.repo = AppDataSource.getRepository(ExerciseModel);
  }

  // ExerciseModel (BD) -> Exercise (dominio)
  private toDomain(model: ExerciseModel): Exercise {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      durationSeconds: model.durationSeconds,
      resourceType: model.resourceType,
      resourceUrl: model.resourceUrl,
      isActive: model.isActive !== false,
      categoryId: model.category?.id ?? null,
      category: model.category
        ? {
            id: model.category.id,
            name: model.category.name,
            description: model.category.description,
            isActive: model.category.isActive !== false,
          }
        : null,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  // Exercise (dominio) -> ExerciseModel (BD): categoryId se guarda a través de la relación `category`
  private toModel(exercise: Partial<Exercise>): DeepPartial<ExerciseModel> {
    const { categoryId, category: _category, ...rest } = exercise;
    return {
      ...rest,
      ...(categoryId !== undefined && categoryId !== null ? { category: { id: categoryId } } : {}),
    } as DeepPartial<ExerciseModel>;
  }

  async create(exercise: Partial<Exercise>): Promise<Exercise> {
    const result = await this.repo.insert(withoutUndefined(this.toModel(exercise)) as never);
    return (await this.findById(result.identifiers[0]!.id)) as Exercise;
  }

  async update(id: number, exercise: Partial<Exercise>): Promise<Exercise | null> {
    const changes = withoutUndefined(this.toModel(exercise));
    if (!isEmpty(changes)) await this.repo.update(id, changes as never);
    return this.findById(id);
  }

  async findById(id: number): Promise<Exercise | null> {
    const found = await this.repo.findOne({ where: { id }, relations: { category: true } });
    return found ? this.toDomain(found) : null;
  }

  async findAll(filter: ExerciseFilter): Promise<Exercise[]> {
    const qb = this.repo
      .createQueryBuilder("e")
      .leftJoinAndSelect("e.category", "c")
      .orderBy("e.name", "ASC");

    if (filter.search) {
      qb.andWhere("(e.name ILIKE :s OR e.description ILIKE :s)", { s: `%${filter.search}%` });
    }
    if (filter.categoryId) {
      qb.andWhere("c.id = :categoryId", { categoryId: filter.categoryId });
    }
    if (filter.onlyActive) {
      qb.andWhere("e.is_active = true");
    }

    const found = await qb.getMany();
    return found.map((m) => this.toDomain(m));
  }

  async findByIds(ids: number[]): Promise<Exercise[]> {
    if (ids.length === 0) return [];
    const found = await this.repo.find({ where: { id: In(ids) }, relations: { category: true } });
    return found.map((m) => this.toDomain(m));
  }
}
