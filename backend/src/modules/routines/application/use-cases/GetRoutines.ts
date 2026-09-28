// Listar rutinas con filtros (búsqueda, tipo, solo activas)
import { RoutineFilter, RoutinePort } from "../../domain/ports/RoutinePort";
import { Routine } from "../../domain/entities/Routine";

export class GetRoutines {
  constructor(private routinePort: RoutinePort) {}

  async execute(filter: RoutineFilter): Promise<Routine[]> {
    return this.routinePort.findAll(filter);
  }
}
