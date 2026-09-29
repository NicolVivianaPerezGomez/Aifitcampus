// Entidad de dominio: TypeScript puro, no depende de frameworks.
// El mapeo a la tabla `routine_types` está en infrastructure/persistence/RoutineTypeModel.ts
export interface RoutineType {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
}
