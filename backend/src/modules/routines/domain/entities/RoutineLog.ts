// Entidad de dominio: TypeScript puro, no depende de frameworks.
// Registro de una ejecución de rutina. Mapeo en infrastructure/persistence/RoutineLogModel.ts

export const ROUTINE_LOG_STATUS = {
  COMPLETED: "completada",
  ABANDONED: "abandonada",
} as const;

export interface RoutineLog {
  id: number;
  userId: number | null;
  routineId: number | null;
  routineName: string | null; // nombre de la rutina cuando se consultan juntos
  startedAt: Date | null;
  endedAt: Date | null;
  completionPercentage: number | null;
  status: string | null;
  durationSeconds: number | null;
}
