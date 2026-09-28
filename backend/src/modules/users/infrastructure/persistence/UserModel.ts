// Mapeo de la tabla generado con typeorm-model-generator desde la base de datos.
// Capa de infraestructura (persistencia): aquí sí se usa TypeORM.
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AuditModel } from "../../../audits/infrastructure/persistence/AuditModel";
import { RoutineLogModel } from "../../../routines/infrastructure/persistence/RoutineLogModel";
import { RoutineModel } from "../../../routines/infrastructure/persistence/RoutineModel";
import { UserBadgeModel } from "../../../badges/infrastructure/persistence/UserBadgeModel";
// Pendiente: se activa cuando se suba el módulo notifications
// import { NotificationModel } from "../../../notifications/infrastructure/persistence/NotificationModel";
import { RoleModel } from "../../../roles/infrastructure/persistence/RoleModel";

@Index("users_email_key", ["email"], { unique: true })
@Index("users_pkey", ["id"], { unique: true })
@Entity("users", { schema: "public" })
export class UserModel {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "first_name", length: 150 })
  firstName: string;

  @Column("character varying", { name: "last_name", length: 150 })
  lastName: string;

  @Column("character varying", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("character varying", {
    name: "password",
    nullable: true,
    length: 255,
  })
  password: string | null;

  @Column("character varying", {
    name: "microsoft_id",
    nullable: true,
    length: 255,
  })
  microsoftId: string | null;

  @Column("character varying", {
    name: "auth_provider",
    length: 20,
    default: () => "'local'",
  })
  authProvider: string;

  @Column("character varying", {
    name: "job_title",
    nullable: true,
    length: 150,
  })
  jobTitle: string | null;

  @Column("character varying", {
    name: "department",
    nullable: true,
    length: 150,
  })
  department: string | null;

  @Column("character varying", {
    name: "office_location",
    nullable: true,
    length: 150,
  })
  officeLocation: string | null;

  @Column("character varying", {
    name: "mobile_phone",
    nullable: true,
    length: 50,
  })
  mobilePhone: string | null;

  @Column("text", { name: "business_phones", nullable: true })
  businessPhones: string | null;

  @Column("json", { name: "permissions", nullable: true })
  permissions: object | null;

  @Column("integer", { name: "program_id" })
  programId: number;

  @Column("integer", { name: "status_id" })
  statusId: number;

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @OneToMany(() => AuditModel, (audits) => audits.user)
  audits: AuditModel[];

  @OneToMany(() => RoutineLogModel, (routineLogs) => routineLogs.user)
  routineLogs: RoutineLogModel[];

  @OneToMany(() => RoutineModel, (routines) => routines.user)
  routines: RoutineModel[];

  @OneToMany(() => UserBadgeModel, (userBadges) => userBadges.user)
  userBadges: UserBadgeModel[];

  // Pendiente: se activa cuando se suba el módulo notifications
  // @ManyToMany(() => NotificationModel, (notifications) => notifications.users)
  // notifications: NotificationModel[];

  @ManyToOne(() => RoleModel, (roles) => roles.users)
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: RoleModel;
}
