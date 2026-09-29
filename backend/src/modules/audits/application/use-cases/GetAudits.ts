import { AuditPort, AuditFilter } from "../../domain/ports/AuditPort";
import { Audit } from "../../domain/entities/Audit";

export class GetAudits {
  constructor(private auditPort: AuditPort) {}

  async execute(filter: AuditFilter): Promise<Audit[]> {
    return this.auditPort.findAll(filter);
  }
}
