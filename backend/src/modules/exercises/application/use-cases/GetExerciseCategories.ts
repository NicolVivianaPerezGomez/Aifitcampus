// Listar categorías de ejercicios
import { ExerciseCategoryPort } from "../../domain/ports/ExerciseCategoryPort";
import { ExerciseCategory } from "../../domain/entities/ExerciseCategory";

export class GetExerciseCategories {
  constructor(private categoryPort: ExerciseCategoryPort) {}

  async execute(onlyActive: boolean): Promise<ExerciseCategory[]> {
    return this.categoryPort.findAll(onlyActive);
  }
}
