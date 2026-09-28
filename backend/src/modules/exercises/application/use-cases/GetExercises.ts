// Listar ejercicios con filtros (búsqueda, categoría, solo activos)
import { ExerciseFilter, ExercisePort } from "../../domain/ports/ExercisePort";
import { Exercise } from "../../domain/entities/Exercise";

export class GetExercises {
  constructor(private exercisePort: ExercisePort) {}

  async execute(filter: ExerciseFilter): Promise<Exercise[]> {
    return this.exercisePort.findAll(filter);
  }
}
