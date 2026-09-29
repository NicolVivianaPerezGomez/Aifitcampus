// Mapeo de la tabla generado con typeorm-model-generator desde la base de datos.
// Capa de infraestructura (persistencia): aquí sí se usa TypeORM.
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RoutineModel } from "./RoutineModel";

@Index("routine_types_pkey", ["id"], { unique: true })
@Entity("routine_types", { schema: "public" })
export class RoutineTypeModel {
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

  @OneToMany(() => RoutineModel, (routines) => routines.routineType)
  routines: RoutineModel[];
}
