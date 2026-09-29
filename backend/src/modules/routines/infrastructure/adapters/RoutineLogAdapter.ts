import { Repository } from "typeorm";
import { AppDataSource } from "../../../../shared/config/data-base";
import { RoutineLogModel } from "../persistence/RoutineLogModel";
import { RoutineLog } from "../../domain/entities/RoutineLog";
import { RoutineLogPort } from "../../domain/ports/RoutineLogPort";

// Adaptador: conecta el dominio (RoutineLog) con la base de datos (RoutineLogModel).
export class RoutineLogAdapter implements RoutineLogPort {
  private repo: Repository<RoutineLogModel>;

  constructor() {
    this.repo = AppDataSource.getRepository(RoutineLogModel);
  }

  // RoutineLogModel (BD) -> RoutineLog (dominio)
  private toDomain(model: RoutineLogModel): RoutineLog {
    return {
      id: model.id,
      userId: model.user?.id ?? null,
      routineId: model.routine?.id ?? null,
      routineName: model.routine?.name ?? null,
      startedAt: model.startedAt,
      endedAt: model.endedAt,
      // numeric llega como texto desde PostgreSQL
      completionPercentage: model.completionPercentage !== null ? Number(model.completionPercentage) : null,
      status: model.status,
      durationSeconds: model.durationSeconds,
    };
  }

  async create(log: Omit<RoutineLog, "id" | "routineName">): Promise<RoutineLog> {
    const result = await this.repo.insert({
      ...(log.userId !== null ? { user: { id: log.userId } } : {}),
      ...(log.routineId !== null ? { routine: { id: log.routineId } } : {}),
      startedAt: log.startedAt,
      endedAt: log.endedAt,
      completionPercentage: log.completionPercentage !== null ? String(log.completionPercentage) : null,
      status: log.status,
      durationSeconds: log.durationSeconds,
    });
    const found = await this.repo.findOne({
      where: { id: result.identifiers[0]!.id },
      relations: { routine: true, user: true },
    });
    return this.toDomain(found as RoutineLogModel);
  }

  async findByUser(userId: number): Promise<RoutineLog[]> {
    const found = await this.repo.find({
      where: { user: { id: userId } },
      relations: { routine: true, user: true },
      order: { startedAt: "DESC" },
    });
    return found.map((m) => this.toDomain(m));
  }
}
