// "Eliminar" tipo de rutina: se inactiva. No se permite si tiene rutinas activas.
import { RoutineTypePort } from "../../domain/ports/RoutineTypePort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { AppError } from "../../../../shared/utils/AppError";

export class DeactivateRoutineType {
  constructor(private routineTypePort: RoutineTypePort, private auditPort: AuditPort) {}

  async execute(id: number, actorUserId: number): Promise<void> {
    const routineType = await this.routineTypePort.findById(id);
    if (!routineType) {
      throw new AppError("Tipo de rutina no encontrado", 404);
    }
    if (!routineType.isActive) {
      throw new AppError("El tipo de rutina ya está inactivo", 409);
    }

    const activeRoutines = await this.routineTypePort.countActiveRoutines(id);
    if (activeRoutines > 0) {
      throw new AppError(
        `No es posible inactivar el tipo de rutina: tiene ${activeRoutines} rutina(s) activa(s)`,
        409
      );
    }

    await this.routineTypePort.update(id, { isActive: false });

    await this.auditPort.register({
      userId: actorUserId,
      action: "DELETE",
      entity: "routine_types",
      description: `Tipo de rutina inactivado: ${routineType.name} (id ${id})`,
    });
  }
}
