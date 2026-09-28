// Mapeo de la tabla generado con typeorm-model-generator desde la base de datos.
// Capa de infraestructura (persistencia): aquí sí se usa TypeORM.
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ExerciseModel } from "./ExerciseModel";
import { RoutineModel } from "../../../routines/infrastructure/persistence/RoutineModel";

@Index("exercise_routines_pkey", ["id"], { unique: true })
@Index(
  "exercise_routines_routine_id_order_index_key",
  ["orderIndex", "routineId"],
  { unique: true }
)
@Entity("exercise_routines", { schema: "public" })
export class ExerciseRoutineModel {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "routine_id", unique: true })
  routineId: number;

  @Column("integer", { name: "order_index", unique: true })
  orderIndex: number;

  @Column("integer", { name: "sets", nullable: true })
  sets: number | null;

  @Column("integer", { name: "reps", nullable: true })
  reps: number | null;

  @Column("integer", { name: "rest_seconds", nullable: true })
  restSeconds: number | null;

  @ManyToOne(() => ExerciseModel, (exercises) => exercises.exerciseRoutines, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "exercise_id", referencedColumnName: "id" }])
  exercise: ExerciseModel;

  @ManyToOne(() => RoutineModel, (routines) => routines.exerciseRoutines, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "routine_id", referencedColumnName: "id" }])
  routine: RoutineModel;
}
