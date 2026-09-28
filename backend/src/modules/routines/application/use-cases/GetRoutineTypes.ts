// Listar tipos de rutina
import { RoutineTypeFilter, RoutineTypePort } from "../../domain/ports/RoutineTypePort";
import { RoutineType } from "../../domain/entities/RoutineType";

export class GetRoutineTypes {
  constructor(private routineTypePort: RoutineTypePort) {}

  async execute(filter: RoutineTypeFilter): Promise<RoutineType[]> {
    return this.routineTypePort.findAll(filter);
  }
}
