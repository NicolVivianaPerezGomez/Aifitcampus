// Editar ejercicio (también permite reactivarlo con isActive: true)
import { ExercisePort } from "../../domain/ports/ExercisePort";
import { ExerciseCategoryPort } from "../../domain/ports/ExerciseCategoryPort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { UpdateExerciseDto } from "../dto/ExerciseDto";
import { Exercise } from "../../domain/entities/Exercise";
import { AppError } from "../../../../shared/utils/AppError";

export class UpdateExercise {
  constructor(
    private exercisePort: ExercisePort,
    private categoryPort: ExerciseCategoryPort,
    private auditPort: AuditPort
  ) {}

  async execute(id: number, dto: UpdateExerciseDto, actorUserId: number): Promise<Exercise> {
    const exercise = await this.exercisePort.findById(id);
    if (!exercise) {
      throw new AppError("Ejercicio no encontrado", 404);
    }

    const changes: Partial<Exercise> = { updatedAt: new Date() };
    if (dto.name !== undefined) changes.name = dto.name;
    if (dto.description !== undefined) changes.description = dto.description;
    if (dto.durationSeconds !== undefined) changes.durationSeconds = dto.durationSeconds;
    if (dto.resourceUrl !== undefined) changes.resourceUrl = dto.resourceUrl;
    if (dto.isActive !== undefined) changes.isActive = dto.isActive;

    if (dto.categoryId !== undefined) {
      const category = await this.categoryPort.findById(dto.categoryId);
      if (!category || category.isActive === false) {
        throw new AppError("La categoría no existe o está inactiva", 404);
      }
      changes.categoryId = dto.categoryId;
    }

    const updated = await this.exercisePort.update(id, changes);

    await this.auditPort.register({
      userId: actorUserId,
      action: "UPDATE",
      entity: "exercises",
      description: `Ejercicio actualizado: ${exercise.name} (id ${id})`,
    });

    return updated as Exercise;
  }
}
