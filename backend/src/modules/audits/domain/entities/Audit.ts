// Entidad de dominio: TypeScript puro, no depende de frameworks.
// El mapeo a la tabla `audits` está en infrastructure/persistence/AuditModel.ts
export interface Audit {
  id: number;
  userId: number | null; // quién hizo la acción
  action: string;        // CREATE, UPDATE, DELETE...
  entity: string;        // tabla afectada
  description: string | null;
  createdAt: Date | null;
}
