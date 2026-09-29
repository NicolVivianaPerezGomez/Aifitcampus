// "Eliminar" rutina: se inactiva (is_active = false) para conservar el historial.
// Si alguien la hizo en los últimos 7 días, se pide confirmación (confirm=true).
import { RoutinePort } from "../../domain/ports/RoutinePort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { AppError } from "../../../../shared/utils/AppError";

const RECENT_DAYS = 7;

export class DeactivateRoutine {
  constructor(private routinePort: RoutinePort, private auditPort: AuditPort) {}

  async execute(id: number, confirm: boolean, actorUserId: number): Promise<void> {
    const routine = await this.routinePort.findById(id);
    if (!routine) {
      throw new AppError("Rutina no encontrada", 404);
    }
    if (!routine.isActive) {
      throw new AppError("La rutina ya está inactiva", 409);
    }

    const since = new Date(Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000);
    const recentLogs = await this.routinePort.countLogsSince(id, since);
    if (recentLogs > 0 && !confirm) {
      throw new AppError(
        `La rutina se ha realizado ${recentLogs} ${recentLogs === 1 ? "vez" : "veces"} en los últimos ${RECENT_DAYS} días. ` +
          "Confirme la inactivación con ?confirm=true",
        409
      );
    }

    await this.routinePort.update(id, { isActive: false, updatedAt: new Date() });

    await this.auditPort.register({
      userId: actorUserId,
      action: "DELETE",
      entity: "routines",
      description: `Rutina inactivada: ${routine.name} (id ${id})`,
    });
  }
}
