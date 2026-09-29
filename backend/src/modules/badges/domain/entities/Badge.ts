// Entidad de dominio: TypeScript puro, no depende de frameworks.
// El mapeo a la tabla `badges` está en infrastructure/persistence/BadgeModel.ts
export interface Badge {
  id: number;
  name: string;
  description: string | null;
  condition: string | null;   // qué debe lograr el usuario (ej. "pausas_completadas")
  targetValue: number | null; // la meta de esa condición (ej. 10)
  isActive: boolean;
}
