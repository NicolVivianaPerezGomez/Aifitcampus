import { Audit } from "../entities/Audit";

export interface AuditPort {
  register(entry: Omit<Audit, "id" | "createdAt">): Promise<void>;
}
