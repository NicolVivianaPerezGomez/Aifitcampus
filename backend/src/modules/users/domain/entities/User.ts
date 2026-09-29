// Entidad de dominio: TypeScript puro, no depende de frameworks.
// El mapeo a la tabla `users` está en infrastructure/persistence/UserModel.ts
import { Role } from "../../../roles/domain/entities/Role";

// Valores de users.status_id (la BD no tiene tabla de estados).
export const ACCOUNT_STATUS = {
  ACTIVE: 1,
  INACTIVE: 2,
} as const;

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string | null;
  microsoftId: string | null;
  authProvider: string;
  jobTitle: string | null;
  department: string | null;
  officeLocation: string | null;
  mobilePhone: string | null;
  businessPhones: string | null;
  permissions: Record<string, unknown> | null;
  roleId: number;
  role: Role | null; // datos del rol cuando se consultan junto al usuario
  programId: number;
  statusId: number;
  createdAt: Date;
  
}
