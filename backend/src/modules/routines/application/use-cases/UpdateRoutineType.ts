// Editar tipo de rutina (también permite reactivarlo con isActive: true)
import { RoutineTypePort } from "../../domain/ports/RoutineTypePort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { UpdateRoutineTypeDto } from "../dto/RoutineTypeDto";
import { RoutineType } from "../../domain/entities/RoutineType";
import { AppError } from "../../../../shared/utils/AppError";

export class UpdateRoutineType {
  constructor(private routineTypePort: RoutineTypePort, private auditPort: AuditPort) {}

  async execute(id: number, dto: UpdateRoutineTypeDto, actorUserId: number): Promise<RoutineType> {
    const routineType = await this.routineTypePort.findById(id);
    if (!routineType) {
      throw new AppError("Tipo de rutina no encontrado", 404);
    }
    // Un tipo inactivo solo se puede reactivar
    if (!routineType.isActive && dto.isActive !== true) {
      throw new AppError("No es posible editar un tipo de rutina inactivo. Reactívelo primero", 409);
    }

    if (dto.name !== undefined && dto.name.trim().toLowerCase() !== routineType.name.toLowerCase()) {
      const existing = await this.routineTypePort.findByName(dto.name);
      if (existing) {
        throw new AppError("Ya existe un tipo de rutina con ese nombre", 409);
      }
    }

    const changes: Partial<RoutineType> = {};
    if (dto.name !== undefined) changes.name = dto.name.trim();
    if (dto.description !== undefined) changes.description = dto.description.trim() || null;
    if (dto.isActive !== undefined) changes.isActive = dto.isActive;

    const updated = await this.routineTypePort.update(id, changes);

    await this.auditPort.register({
      userId: actorUserId,
      action: "UPDATE",
      entity: "routine_types",
      description: `Tipo de rutina actualizado: ${routineType.name} (id ${id})`,
    });

    return updated as RoutineType;
  }
}
