// Crear rutina con su lista de ejercicios
import { RoutinePort } from "../../domain/ports/RoutinePort";
import { RoutineTypePort } from "../../domain/ports/RoutineTypePort";
import { ExercisePort } from "../../../exercises/domain/ports/ExercisePort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { CreateRoutineDto } from "../dto/RoutineDto";
import { Routine } from "../../domain/entities/Routine";
import { PrepareRoutineExercises } from "./PrepareRoutineExercises";
import { AppError } from "../../../../shared/utils/AppError";

export class CreateRoutine {
  constructor(
    private routinePort: RoutinePort,
    private routineTypePort: RoutineTypePort,
    private exercisePort: ExercisePort,
    private auditPort: AuditPort
  ) {}

  async execute(dto: CreateRoutineDto, actorUserId: number): Promise<Routine> {
    const routineType = await this.routineTypePort.findById(dto.routineTypeId);
    if (!routineType || !routineType.isActive) {
      throw new AppError("El tipo de rutina no existe o está inactivo", 404);
    }

    const { exercises, totalDurationSeconds } = await new PrepareRoutineExercises(this.exercisePort).execute(
      dto.exercises
    );

    const routine = await this.routinePort.create(
      {
        name: dto.name.trim(),
        description: dto.description?.trim() || null,
        routineTypeId: dto.routineTypeId,
        totalDurationSeconds,
        userId: actorUserId,
        isActive: true,
      },
      exercises
    );

    await this.auditPort.register({
      userId: actorUserId,
      action: "CREATE",
      entity: "routines",
      description: `Rutina creada: ${routine.name} (id ${routine.id})`,
    });

    return routine;
  }
}
