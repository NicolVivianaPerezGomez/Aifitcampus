import { Routine, RoutineExerciseItem } from "../entities/Routine";

export interface RoutineFilter {
  search?: string;        // coincide contra nombre o descripción
  routineTypeId?: number;
  onlyActive?: boolean;
}

// Ejercicio a guardar en la rutina (sin los datos del ejercicio)
export type RoutineExerciseInput = Omit<RoutineExerciseItem, "exercise">;

export interface RoutinePort {
  // Guarda la rutina y su lista de ejercicios en una sola transacción
  create(routine: Partial<Routine>, exercises: RoutineExerciseInput[]): Promise<Routine>;
  // Si se envía `exercises`, reemplaza la lista completa
  update(id: number, routine: Partial<Routine>, exercises?: RoutineExerciseInput[]): Promise<Routine | null>;
  findById(id: number): Promise<Routine | null>;
  findAll(filter: RoutineFilter): Promise<Routine[]>;
  countLogsSince(routineId: number, since: Date): Promise<number>;
}
