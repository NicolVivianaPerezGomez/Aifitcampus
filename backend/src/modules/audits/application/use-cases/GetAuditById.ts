import { AuditPort } from "../../domain/ports/AuditPort";
import { Audit } from "../../domain/entities/Audit";
import { AppError } from "../../../../shared/utils/AppError";

export class GetAuditById {
  constructor(private auditPort: AuditPort) {}

  async execute(id: number): Promise<Audit> {
    const audit = await this.auditPort.findById(id);
    if (!audit) {
      throw new AppError("Registro de auditoría no encontrado", 404);
    }
    return audit;
  }
}
