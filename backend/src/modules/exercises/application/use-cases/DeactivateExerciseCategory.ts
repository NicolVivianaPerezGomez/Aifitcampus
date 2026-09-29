// "Eliminar" categoría: se inactiva. No se permite si tiene ejercicios activos.
import { ExerciseCategoryPort } from "../../domain/ports/ExerciseCategoryPort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { AppError } from "../../../../shared/utils/AppError";

export class DeactivateExerciseCategory {
  constructor(private categoryPort: ExerciseCategoryPort, private auditPort: AuditPort) {}

  async execute(id: number, actorUserId: number): Promise<void> {
    const category = await this.categoryPort.findById(id);
    if (!category) {
      throw new AppError("Categoría no encontrada", 404);
    }

    const activeExercises = await this.categoryPort.countActiveExercises(id);
    if (activeExercises > 0) {
      throw new AppError(
        `No es posible inactivar la categoría: tiene ${activeExercises} ejercicio(s) activo(s)`,
        409
      );
    }

    await this.categoryPort.update(id, { isActive: false });

    await this.auditPort.register({
      userId: actorUserId,
      action: "DELETE",
      entity: "exercise_categories",
      description: `Categoría inactivada: ${category.name} (id ${id})`,
    });
  }
}
