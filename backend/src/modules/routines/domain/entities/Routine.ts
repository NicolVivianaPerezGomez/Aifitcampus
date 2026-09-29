// Entidad de dominio: TypeScript puro, no depende de frameworks.
// El mapeo a la tabla `routines` está en infrastructure/persistence/RoutineModel.ts
import { RoutineType } from "./RoutineType";
import { Exercise } from "../../../exercises/domain/entities/Exercise";

// Un ejercicio dentro de la rutina (tabla exercise_routines)
export interface RoutineExerciseItem {
  exerciseId: number;
  orderIndex: number;         // posición del ejercicio en la rutina (1, 2, 3...)
  sets: number | null;        // series
  reps: number | null;        // repeticiones
  restSeconds: number | null; // descanso después del ejercicio
  exercise: Exercise | null;  // datos del ejercicio cuando se consultan juntos
}

export interface Routine {
  id: number;
  name: string;
  description: string | null;
  totalDurationSeconds: number | null;
  isActive: boolean;
  routineTypeId: number | null;
  routineType: RoutineType | null; // datos del tipo cuando se consultan juntos
  userId: number | null;           // quién creó la rutina
  exercises: RoutineExerciseItem[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

/**
 * Regla de negocio: duración total de la rutina.
 * Por cada ejercicio: duración × series (1 si no tiene) + descanso.
 */
export function calculateRoutineDuration(
  items: Pick<RoutineExerciseItem, "exerciseId" | "sets" | "restSeconds">[],
  durationsByExercise: Map<number, number>
): number {
  return items.reduce((total, item) => {
    const duration = durationsByExercise.get(item.exerciseId) ?? 0;
    return total + duration * (item.sets ?? 1) + (item.restSeconds ?? 0);
  }, 0);
}
