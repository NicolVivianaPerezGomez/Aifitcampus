import { Repository } from "typeorm";
import { withoutUndefined, isEmpty } from "../../../../shared/utils/persistence.util";
import { AppDataSource } from "../../../../shared/config/data-base";
import { ExerciseCategoryModel } from "../persistence/ExerciseCategoryModel";
import { ExerciseModel } from "../persistence/ExerciseModel";
import { ExerciseCategory } from "../../domain/entities/ExerciseCategory";
import { ExerciseCategoryPort } from "../../domain/ports/ExerciseCategoryPort";

// Adaptador: conecta el dominio (ExerciseCategory) con la base de datos (ExerciseCategoryModel).
export class ExerciseCategoryAdapter implements ExerciseCategoryPort {
  private repo: Repository<ExerciseCategoryModel>;
  private exerciseRepo: Repository<ExerciseModel>;

  constructor() {
    this.repo = AppDataSource.getRepository(ExerciseCategoryModel);
    this.exerciseRepo = AppDataSource.getRepository(ExerciseModel);
  }

  // ExerciseCategoryModel (BD) -> ExerciseCategory (dominio)
  private toDomain(model: ExerciseCategoryModel): ExerciseCategory {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      isActive: model.isActive !== false,
    };
  }

  async create(category: Partial<ExerciseCategory>): Promise<ExerciseCategory> {
    const result = await this.repo.insert(withoutUndefined(category) as never);
    return (await this.findById(result.identifiers[0]!.id)) as ExerciseCategory;
  }

  async update(id: number, category: Partial<ExerciseCategory>): Promise<ExerciseCategory | null> {
    const changes = withoutUndefined(category);
    if (!isEmpty(changes)) await this.repo.update(id, changes as never);
    return this.findById(id);
  }

  async findById(id: number): Promise<ExerciseCategory | null> {
    const found = await this.repo.findOneBy({ id });
    return found ? this.toDomain(found) : null;
  }

  // Compara sin importar mayúsculas: "Estiramiento" = "estiramiento"
  async findByName(name: string): Promise<ExerciseCategory | null> {
    const found = await this.repo
      .createQueryBuilder("c")
      .where("LOWER(c.name) = LOWER(:name)", { name })
      .getOne();
    return found ? this.toDomain(found) : null;
  }

  async findAll(onlyActive: boolean): Promise<ExerciseCategory[]> {
    const found = await this.repo.find({
      where: onlyActive ? { isActive: true } : {},
      order: { name: "ASC" },
    });
    return found.map((m) => this.toDomain(m));
  }

  async countActiveExercises(categoryId: number): Promise<number> {
    return this.exerciseRepo.count({ where: { category: { id: categoryId }, isActive: true } });
  }
}
