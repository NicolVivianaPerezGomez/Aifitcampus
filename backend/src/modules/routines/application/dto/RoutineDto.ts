// Un ejercicio dentro de la rutina
export interface RoutineExerciseDto {
  exerciseId: number;
  orderIndex: number;   // posición (1, 2, 3...), no se puede repetir
  sets?: number;
  reps?: number;
  restSeconds?: number;
}

export interface CreateRoutineDto {
  name: string;
  description?: string;
  routineTypeId: number;
  exercises: RoutineExerciseDto[]; // al menos uno
}

export interface UpdateRoutineDto {
  name?: string;
  description?: string;
  routineTypeId?: number;
  exercises?: RoutineExerciseDto[]; // si se envía, reemplaza la lista completa
  isActive?: boolean;
}

// Registrar que el usuario hizo la rutina
export interface LogRoutineExecutionDto {
  durationSeconds: number; // cuánto tiempo la hizo
}
