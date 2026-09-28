// Mapeo de la tabla generado con typeorm-model-generator desde la base de datos.
// Capa de infraestructura (persistencia): aquí sí se usa TypeORM.
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ExerciseRoutineModel } from "./ExerciseRoutineModel";
import { ExerciseCategoryModel } from "./ExerciseCategoryModel";

@Index("exercises_pkey", ["id"], { unique: true })
@Entity("exercises", { schema: "public" })
export class ExerciseModel {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 150 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("integer", { name: "duration_seconds", nullable: true })
  durationSeconds: number | null;

  @Column("character varying", {
    name: "resource_type",
    nullable: true,
    length: 50,
  })
  resourceType: string | null;

  @Column("text", { name: "resource_url", nullable: true })
  resourceUrl: string | null;

  @Column("boolean", {
    name: "is_active",
    nullable: true,
    default: () => "true",
  })
  isActive: boolean | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @OneToMany(
    () => ExerciseRoutineModel,
    (exerciseRoutines) => exerciseRoutines.exercise
  )
  exerciseRoutines: ExerciseRoutineModel[];

  @ManyToOne(
    () => ExerciseCategoryModel,
    (exerciseCategories) => exerciseCategories.exercises
  )
  @JoinColumn([{ name: "category_id", referencedColumnName: "id" }])
  category: ExerciseCategoryModel;
}
