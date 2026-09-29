// Ver el detalle de una rutina con sus ejercicios
import { RoutinePort } from "../../domain/ports/RoutinePort";
import { Routine } from "../../domain/entities/Routine";
import { AppError } from "../../../../shared/utils/AppError";

export class GetRoutineById {
  constructor(private routinePort: RoutinePort) {}

  async execute(id: number): Promise<Routine> {
    const routine = await this.routinePort.findById(id);
    if (!routine) {
      throw new AppError("Rutina no encontrada", 404);
    }
    return routine;
  }
}
