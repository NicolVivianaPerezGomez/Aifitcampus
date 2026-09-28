// Entidad de dominio: TypeScript puro, no depende de frameworks.
// Relación ejercicio-rutina. Mapeo en infrastructure/persistence/ExerciseRoutineModel.ts
export interface ExerciseRoutine {
  id: number;
  routineId: number;
  exerciseId: number;
  orderIndex: number;
  sets: number | null;
  reps: number | null;
  restSeconds: number | null;
}
