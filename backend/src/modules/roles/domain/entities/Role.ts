// Entidad de dominio: TypeScript puro, no depende de frameworks.
// El mapeo a la tabla `roles` está en infrastructure/persistence/RoleModel.ts
export interface Role {
  id: number;
  name: string;
}
