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
import { UserModel } from "../../../users/infrastructure/persistence/UserModel";

@Index("audits_pkey", ["id"], { unique: true })
@Entity("audits", { schema: "public" })
export class AuditModel {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "action", length: 100 })
  action: string;

  @Column("character varying", { name: "entity", length: 100 })
  entity: string;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @ManyToOne(() => UserModel, (users) => users.audits, { onDelete: "SET NULL" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: UserModel;
}
