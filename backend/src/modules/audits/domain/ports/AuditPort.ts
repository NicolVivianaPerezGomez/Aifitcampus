import { Audit } from "../entities/Audit";

export interface AuditFilter {
  userId?: number;
  entity?: string;
  action?: string;
  limit?: number;
  offset?: number;
}

export interface AuditPort {
  register(entry: Omit<Audit, "id" | "createdAt">): Promise<void>;
  findAll(filter: AuditFilter): Promise<Audit[]>;
  findById(id: number): Promise<Audit | null>;
}
