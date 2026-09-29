// Ver el detalle de un ejercicio
import { ExercisePort } from "../../domain/ports/ExercisePort";
import { Exercise } from "../../domain/entities/Exercise";
import { AppError } from "../../../../shared/utils/AppError";

export class GetExerciseById {
  constructor(private exercisePort: ExercisePort) {}

  async execute(id: number): Promise<Exercise> {
    const exercise = await this.exercisePort.findById(id);
    if (!exercise) {
      throw new AppError("Ejercicio no encontrado", 404);
    }
    return exercise;
  }
}
