// Crear ejercicio (por video)
import { ExercisePort } from "../../domain/ports/ExercisePort";
import { ExerciseCategoryPort } from "../../domain/ports/ExerciseCategoryPort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { CreateExerciseDto } from "../dto/ExerciseDto";
import { Exercise, EXERCISE_RESOURCE_TYPE } from "../../domain/entities/Exercise";
import { AppError } from "../../../../shared/utils/AppError";

export class CreateExercise {
  constructor(
    private exercisePort: ExercisePort,
    private categoryPort: ExerciseCategoryPort,
    private auditPort: AuditPort
  ) {}

  async execute(dto: CreateExerciseDto, actorUserId: number): Promise<Exercise> {
    const category = await this.categoryPort.findById(dto.categoryId);
    if (!category || category.isActive === false) {
      throw new AppError("La categoría no existe o está inactiva", 404);
    }

    const exercise = await this.exercisePort.create({
      name: dto.name,
      description: dto.description ?? null,
      durationSeconds: dto.durationSeconds ?? null,
      resourceType: EXERCISE_RESOURCE_TYPE,
      resourceUrl: dto.resourceUrl,
      categoryId: dto.categoryId,
      isActive: true,
    });

    await this.auditPort.register({
      userId: actorUserId,
      action: "CREATE",
      entity: "exercises",
      description: `Ejercicio creado: ${exercise.name} (id ${exercise.id})`,
    });

    return exercise;
  }
}
