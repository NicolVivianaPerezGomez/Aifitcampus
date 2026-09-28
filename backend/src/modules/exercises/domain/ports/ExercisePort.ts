import { Exercise } from "../entities/Exercise";

export interface ExerciseFilter {
  search?: string;      // coincide contra nombre o descripción
  categoryId?: number;
  onlyActive?: boolean;
}

export interface ExercisePort {
  create(exercise: Partial<Exercise>): Promise<Exercise>;
  update(id: number, exercise: Partial<Exercise>): Promise<Exercise | null>;
  findById(id: number): Promise<Exercise | null>;
  findAll(filter: ExerciseFilter): Promise<Exercise[]>;
  findByIds(ids: number[]): Promise<Exercise[]>;
}
