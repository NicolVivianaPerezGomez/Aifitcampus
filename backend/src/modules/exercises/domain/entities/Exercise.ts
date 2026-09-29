// Entidad de dominio: TypeScript puro, no depende de frameworks.
// El mapeo a la tabla `exercises` está en infrastructure/persistence/ExerciseModel.ts
import { ExerciseCategory } from "./ExerciseCategory";

// Los ejercicios son por video
export const EXERCISE_RESOURCE_TYPE = "video";

export interface Exercise {
  id: number;
  name: string;
  description: string | null;
  durationSeconds: number | null;
  resourceType: string | null; // siempre "video"
  resourceUrl: string | null;  // enlace del video
  isActive: boolean;
  categoryId: number | null;
  category: ExerciseCategory | null; // datos de la categoría cuando se consultan juntos
  createdAt: Date | null;
  updatedAt: Date | null;
}
