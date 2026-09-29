// Editar categoría (también permite reactivarla con isActive: true)
import { ExerciseCategoryPort } from "../../domain/ports/ExerciseCategoryPort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { UpdateExerciseCategoryDto } from "../dto/ExerciseCategoryDto";
import { ExerciseCategory } from "../../domain/entities/ExerciseCategory";
import { AppError } from "../../../../shared/utils/AppError";

export class UpdateExerciseCategory {
  constructor(private categoryPort: ExerciseCategoryPort, private auditPort: AuditPort) {}

  async execute(id: number, dto: UpdateExerciseCategoryDto, actorUserId: number): Promise<ExerciseCategory> {
    const category = await this.categoryPort.findById(id);
    if (!category) {
      throw new AppError("Categoría no encontrada", 404);
    }

    if (dto.name !== undefined && dto.name !== category.name) {
      const existing = await this.categoryPort.findByName(dto.name);
      if (existing) {
        throw new AppError("Ya existe una categoría con ese nombre", 409);
      }
    }

    const changes: Partial<ExerciseCategory> = {};
    if (dto.name !== undefined) changes.name = dto.name;
    if (dto.description !== undefined) changes.description = dto.description;
    if (dto.isActive !== undefined) changes.isActive = dto.isActive;

    const updated = await this.categoryPort.update(id, changes);

    await this.auditPort.register({
      userId: actorUserId,
      action: "UPDATE",
      entity: "exercise_categories",
      description: `Categoría actualizada: ${category.name} (id ${id})`,
    });

    return updated as ExerciseCategory;
  }
}
