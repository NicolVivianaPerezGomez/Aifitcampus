// Crear categoría de ejercicios
import { ExerciseCategoryPort } from "../../domain/ports/ExerciseCategoryPort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { CreateExerciseCategoryDto } from "../dto/ExerciseCategoryDto";
import { ExerciseCategory } from "../../domain/entities/ExerciseCategory";
import { AppError } from "../../../../shared/utils/AppError";

export class CreateExerciseCategory {
  constructor(private categoryPort: ExerciseCategoryPort, private auditPort: AuditPort) {}

  async execute(dto: CreateExerciseCategoryDto, actorUserId: number): Promise<ExerciseCategory> {
    const existing = await this.categoryPort.findByName(dto.name);
    if (existing) {
      throw new AppError("Ya existe una categoría con ese nombre", 409);
    }

    const category = await this.categoryPort.create({
      name: dto.name,
      description: dto.description ?? null,
      isActive: true,
    });

    await this.auditPort.register({
      userId: actorUserId,
      action: "CREATE",
      entity: "exercise_categories",
      description: `Categoría creada: ${category.name} (id ${category.id})`,
    });

    return category;
  }
}
