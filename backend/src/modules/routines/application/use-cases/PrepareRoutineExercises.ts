// Valida la lista de ejercicios de una rutina y calcula su duración total.
// Lo usan CreateRoutine y UpdateRoutine.
import { ExercisePort } from "../../../exercises/domain/ports/ExercisePort";
import { RoutineExerciseInput } from "../../domain/ports/RoutinePort";
import { calculateRoutineDuration } from "../../domain/entities/Routine";
import { RoutineExerciseDto } from "../dto/RoutineDto";
import { AppError } from "../../../../shared/utils/AppError";

export class PrepareRoutineExercises {
  constructor(private exercisePort: ExercisePort) {}

  async execute(items: RoutineExerciseDto[]): Promise<{ exercises: RoutineExerciseInput[]; totalDurationSeconds: number }> {
    if (items.length === 0) {
      throw new AppError("La rutina debe tener al menos un ejercicio", 400);
    }

    // No se puede repetir la posición (restricción de la tabla exercise_routines)
    const positions = items.map((item) => item.orderIndex);
    if (new Set(positions).size !== positions.length) {
      throw new AppError("Hay ejercicios con la misma posición (orderIndex) en la rutina", 400);
    }

    // Todos los ejercicios deben existir y estar activos
    const ids = [...new Set(items.map((item) => item.exerciseId))];
    const found = await this.exercisePort.findByIds(ids);
    const missing = ids.filter((id) => !found.some((e) => e.id === id));
    if (missing.length > 0) {
      throw new AppError(`No existen los ejercicios con id: ${missing.join(", ")}`, 404);
    }
    const inactive = found.filter((e) => !e.isActive);
    if (inactive.length > 0) {
      throw new AppError(`Estos ejercicios están inactivos: ${inactive.map((e) => e.name).join(", ")}`, 409);
    }

    const exercises: RoutineExerciseInput[] = [...items]
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((item) => ({
        exerciseId: item.exerciseId,
        orderIndex: item.orderIndex,
        sets: item.sets ?? null,
        reps: item.reps ?? null,
        restSeconds: item.restSeconds ?? null,
      }));

    const durations = new Map(found.map((e) => [e.id, e.durationSeconds ?? 0]));
    return { exercises, totalDurationSeconds: calculateRoutineDuration(exercises, durations) };
  }
}
