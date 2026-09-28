// Historial de rutinas realizadas por el usuario
import { RoutineLogPort } from "../../domain/ports/RoutineLogPort";
import { RoutineLog } from "../../domain/entities/RoutineLog";

export class GetRoutineHistory {
  constructor(private routineLogPort: RoutineLogPort) {}

  async execute(userId: number): Promise<RoutineLog[]> {
    return this.routineLogPort.findByUser(userId);
  }
}
