// Mapeo de la tabla generado con typeorm-model-generator desde la base de datos.
// Capa de infraestructura (persistencia): aquí sí se usa TypeORM.
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserBadgeModel } from "./UserBadgeModel";

@Index("badges_pkey", ["id"], { unique: true })
@Entity("badges", { schema: "public" })
export class BadgeModel {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("character varying", {
    name: "condition",
    nullable: true,
    length: 255,
  })
  condition: string | null;

  @Column("integer", { name: "target_value", nullable: true })
  targetValue: number | null;

  @Column("boolean", {
    name: "is_active",
    nullable: true,
    default: () => "true",
  })
  isActive: boolean | null;

  @OneToMany(() => UserBadgeModel, (userBadges) => userBadges.badge)
  userBadges: UserBadgeModel[];
}
