// Entidad de dominio: TypeScript puro, no depende de frameworks.
// El mapeo a la tabla `exercise_categories` está en infrastructure/persistence/ExerciseCategoryModel.ts
export interface ExerciseCategory {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
}
