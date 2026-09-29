// Registrar que el usuario hizo una rutina (tabla routine_logs).
// Si la hizo durante todo el tiempo de la rutina queda "completada";
// si no, queda "abandonada" con el porcentaje que alcanzó.
import { RoutinePort } from "../../domain/ports/RoutinePort";
import { RoutineLogPort } from "../../domain/ports/RoutineLogPort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { LogRoutineExecutionDto } from "../dto/RoutineDto";
import { RoutineLog, ROUTINE_LOG_STATUS } from "../../domain/entities/RoutineLog";
import { AppError } from "../../../../shared/utils/AppError";

export class LogRoutineExecution {
  constructor(
    private routinePort: RoutinePort,
    private routineLogPort: RoutineLogPort,
    private auditPort: AuditPort
  ) {}

  async execute(routineId: number, dto: LogRoutineExecutionDto, userId: number): Promise<RoutineLog> {
    const routine = await this.routinePort.findById(routineId);
    if (!routine) {
      throw new AppError("Rutina no encontrada", 404);
    }
    if (!routine.isActive) {
      throw new AppError("No es posible realizar una rutina inactiva", 409);
    }

    const total = Math.max(routine.totalDurationSeconds ?? 0, 1); // evita dividir entre 0
    const completed = dto.durationSeconds >= total;
    const completionPercentage = completed
      ? 100
      : Math.min(99, Math.round((dto.durationSeconds / total) * 100));

    const endedAt = new Date();
    const startedAt = new Date(endedAt.getTime() - dto.durationSeconds * 1000);

    const log = await this.routineLogPort.create({
      userId,
      routineId,
      startedAt,
      endedAt,
      completionPercentage,
      status: completed ? ROUTINE_LOG_STATUS.COMPLETED : ROUTINE_LOG_STATUS.ABANDONED,
      durationSeconds: dto.durationSeconds,
    });

    await this.auditPort.register({
      userId,
      action: completed ? "COMPLETE" : "ABANDON",
      entity: "routine_logs",
      description: `Rutina "${routine.name}" (id ${routineId}) ${log.status} al ${completionPercentage}%`,
    });

    return log;
  }
}
