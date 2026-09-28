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
import { RoutineModel } from "./RoutineModel";
import { UserModel } from "../../../users/infrastructure/persistence/UserModel";

@Index("routine_logs_pkey", ["id"], { unique: true })
@Entity("routine_logs", { schema: "public" })
export class RoutineLogModel {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp without time zone", { name: "started_at", nullable: true })
  startedAt: Date | null;

  @Column("timestamp without time zone", { name: "ended_at", nullable: true })
  endedAt: Date | null;

  @Column("numeric", {
    name: "completion_percentage",
    nullable: true,
    precision: 5,
    scale: 2,
  })
  completionPercentage: string | null;

  @Column("character varying", { name: "status", nullable: true, length: 50 })
  status: string | null;

  @Column("integer", { name: "duration_seconds", nullable: true })
  durationSeconds: number | null;

  @ManyToOne(() => RoutineModel, (routines) => routines.routineLogs)
  @JoinColumn([{ name: "routine_id", referencedColumnName: "id" }])
  routine: RoutineModel;

  @ManyToOne(() => UserModel, (users) => users.routineLogs)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: UserModel;
}
