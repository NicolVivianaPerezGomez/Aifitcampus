// Crear tipo de rutina
import { RoutineTypePort } from "../../domain/ports/RoutineTypePort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { CreateRoutineTypeDto } from "../dto/RoutineTypeDto";
import { RoutineType } from "../../domain/entities/RoutineType";
import { AppError } from "../../../../shared/utils/AppError";

export class CreateRoutineType {
  constructor(private routineTypePort: RoutineTypePort, private auditPort: AuditPort) {}

  async execute(dto: CreateRoutineTypeDto, actorUserId: number): Promise<RoutineType> {
    const existing = await this.routineTypePort.findByName(dto.name);
    if (existing) {
      throw new AppError("Ya existe un tipo de rutina con ese nombre", 409);
    }

    const routineType = await this.routineTypePort.create({
      name: dto.name.trim(),
      description: dto.description?.trim() || null,
      isActive: true,
    });

    await this.auditPort.register({
      userId: actorUserId,
      action: "CREATE",
      entity: "routine_types",
      description: `Tipo de rutina creado: ${routineType.name} (id ${routineType.id})`,
    });

    return routineType;
  }
}
