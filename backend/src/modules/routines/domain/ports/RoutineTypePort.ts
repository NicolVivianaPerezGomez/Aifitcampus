import { RoutineType } from "../entities/RoutineType";

export interface RoutineTypeFilter {
  search?: string;
  onlyActive?: boolean;
}

export interface RoutineTypePort {
  create(routineType: Partial<RoutineType>): Promise<RoutineType>;
  update(id: number, routineType: Partial<RoutineType>): Promise<RoutineType | null>;
  findById(id: number): Promise<RoutineType | null>;
  findByName(name: string): Promise<RoutineType | null>;
  findAll(filter: RoutineTypeFilter): Promise<RoutineType[]>;
  countActiveRoutines(routineTypeId: number): Promise<number>;
}
