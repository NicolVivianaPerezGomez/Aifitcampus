// "Eliminar" ejercicio: se inactiva (is_active = false) para no romper
// las rutinas que ya lo usan (exercise_routines).
import { ExercisePort } from "../../domain/ports/ExercisePort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { AppError } from "../../../../shared/utils/AppError";

export class DeactivateExercise {
  constructor(private exercisePort: ExercisePort, private auditPort: AuditPort) {}

  async execute(id: number, actorUserId: number): Promise<void> {
    const exercise = await this.exercisePort.findById(id);
    if (!exercise) {
      throw new AppError("Ejercicio no encontrado", 404);
    }
    if (exercise.isActive === false) {
      throw new AppError("El ejercicio ya está inactivo", 409);
    }

    await this.exercisePort.update(id, { isActive: false, updatedAt: new Date() });

    await this.auditPort.register({
      userId: actorUserId,
      action: "DELETE",
      entity: "exercises",
      description: `Ejercicio inactivado: ${exercise.name} (id ${id})`,
    });
  }
}
