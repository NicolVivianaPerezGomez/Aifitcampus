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
import { ExerciseRoutineModel } from "../../../exercises/infrastructure/persistence/ExerciseRoutineModel";
// Pendiente: se activa cuando se suba el módulo notifications
// import { NotificationModel } from "../../../notifications/infrastructure/persistence/NotificationModel";
import { RoutineLogModel } from "./RoutineLogModel";
import { RoutineTypeModel } from "./RoutineTypeModel";
import { UserModel } from "../../../users/infrastructure/persistence/UserModel";

@Index("routines_pkey", ["id"], { unique: true })
@Entity("routines", { schema: "public" })
export class RoutineModel {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 150 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("integer", { name: "total_duration_seconds", nullable: true })
  totalDurationSeconds: number | null;

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
    (exerciseRoutines) => exerciseRoutines.routine
  )
  exerciseRoutines: ExerciseRoutineModel[];

  // Pendiente: se activa cuando se suba el módulo notifications
  // @OneToMany(() => NotificationModel, (notifications) => notifications.routine)
  // notifications: NotificationModel[];

  @OneToMany(() => RoutineLogModel, (routineLogs) => routineLogs.routine)
  routineLogs: RoutineLogModel[];

  @ManyToOne(() => RoutineTypeModel, (routineTypes) => routineTypes.routines)
  @JoinColumn([{ name: "routine_type_id", referencedColumnName: "id" }])
  routineType: RoutineTypeModel;

  @ManyToOne(() => UserModel, (users) => users.routines)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: UserModel;
}
