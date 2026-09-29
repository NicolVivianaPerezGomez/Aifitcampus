// Mapeo de la tabla generado con typeorm-model-generator desde la base de datos.
// Capa de infraestructura (persistencia): aquí sí se usa TypeORM.
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ExerciseModel } from "./ExerciseModel";

@Index("exercise_categories_pkey", ["id"], { unique: true })
@Entity("exercise_categories", { schema: "public" })
export class ExerciseCategoryModel {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("boolean", {
    name: "is_active",
    nullable: true,
    default: () => "true",
  })
  isActive: boolean | null;

  @OneToMany(() => ExerciseModel, (exercises) => exercises.category)
  exercises: ExerciseModel[];
}
