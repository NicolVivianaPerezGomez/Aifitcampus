import { Repository } from "typeorm";
import { AppDataSource } from "../../../../shared/config/data-base";
import { AuditModel } from "../persistence/AuditModel";
import { AuditPort } from "../../domain/ports/AuditPort";
import { Audit } from "../../domain/entities/Audit";

// Adaptador: conecta el dominio (Audit) con la base de datos (AuditModel).
export class AuditAdapter implements AuditPort {
  private repo: Repository<AuditModel>;

  constructor() {
    this.repo = AppDataSource.getRepository(AuditModel);
  }

  async register(entry: Omit<Audit, "id" | "createdAt">): Promise<void> {
    // En AuditModel el usuario es la relación `user`; se asigna por su id.
    await this.repo.insert({
      ...(entry.userId !== null ? { user: { id: entry.userId } } : {}),
      action: entry.action,
      entity: entry.entity,
      description: entry.description,
    });
  }
}
