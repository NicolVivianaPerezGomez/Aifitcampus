// Editar rutina (también permite reactivarla con isActive: true)
import { RoutineExerciseInput, RoutinePort } from "../../domain/ports/RoutinePort";
import { RoutineTypePort } from "../../domain/ports/RoutineTypePort";
import { ExercisePort } from "../../../exercises/domain/ports/ExercisePort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { UpdateRoutineDto } from "../dto/RoutineDto";
import { Routine } from "../../domain/entities/Routine";
import { PrepareRoutineExercises } from "./PrepareRoutineExercises";
import { AppError } from "../../../../shared/utils/AppError";

export class UpdateRoutine {
  constructor(
    private routinePort: RoutinePort,
    private routineTypePort: RoutineTypePort,
    private exercisePort: ExercisePort,
    private auditPort: AuditPort
  ) {}

  async execute(id: number, dto: UpdateRoutineDto, actorUserId: number): Promise<Routine> {
    const routine = await this.routinePort.findById(id);
    if (!routine) {
      throw new AppError("Rutina no encontrada", 404);
    }
    // Una rutina inactiva solo se puede reactivar
    if (!routine.isActive && dto.isActive !== true) {
      throw new AppError("No es posible editar una rutina inactiva. Reactívela primero", 409);
    }

    const changes: Partial<Routine> = { updatedAt: new Date() };
    if (dto.name !== undefined) changes.name = dto.name.trim();
    if (dto.description !== undefined) changes.description = dto.description.trim() || null;
    if (dto.isActive !== undefined) changes.isActive = dto.isActive;

    if (dto.routineTypeId !== undefined) {
      const routineType = await this.routineTypePort.findById(dto.routineTypeId);
      if (!routineType || !routineType.isActive) {
        throw new AppError("El tipo de rutina no existe o está inactivo", 404);
      }
      changes.routineTypeId = dto.routineTypeId;
    }

    // Si se envían ejercicios, se reemplaza la lista y se recalcula la duración
    let exercises: RoutineExerciseInput[] | undefined;
    if (dto.exercises !== undefined) {
      const prepared = await new PrepareRoutineExercises(this.exercisePort).execute(dto.exercises);
      exercises = prepared.exercises;
      changes.totalDurationSeconds = prepared.totalDurationSeconds;
    }

    const updated = await this.routinePort.update(id, changes, exercises);

    await this.auditPort.register({
      userId: actorUserId,
      action: "UPDATE",
      entity: "routines",
      description: `Rutina actualizada: ${routine.name} (id ${id})`,
    });

    return updated as Routine;
  }
}
