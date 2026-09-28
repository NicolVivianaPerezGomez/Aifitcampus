import { RoutineLog } from "../entities/RoutineLog";

export interface RoutineLogPort {
  create(log: Omit<RoutineLog, "id" | "routineName">): Promise<RoutineLog>;
  findByUser(userId: number): Promise<RoutineLog[]>;
}
