import { ExerciseCategory } from "../entities/ExerciseCategory";

export interface ExerciseCategoryPort {
  create(category: Partial<ExerciseCategory>): Promise<ExerciseCategory>;
  update(id: number, category: Partial<ExerciseCategory>): Promise<ExerciseCategory | null>;
  findById(id: number): Promise<ExerciseCategory | null>;
  findByName(name: string): Promise<ExerciseCategory | null>;
  findAll(onlyActive: boolean): Promise<ExerciseCategory[]>;
  countActiveExercises(categoryId: number): Promise<number>;
}
