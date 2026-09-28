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
import { BadgeModel } from "./BadgeModel";
import { UserModel } from "../../../users/infrastructure/persistence/UserModel";

@Index("user_badges_user_id_badge_id_key", ["badgeId", "userId"], {
  unique: true,
})
@Index("user_badges_pkey", ["id"], { unique: true })
@Entity("user_badges", { schema: "public" })
export class UserBadgeModel {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "user_id", unique: true })
  userId: number;

  @Column("integer", { name: "badge_id", unique: true })
  badgeId: number;

  @Column("timestamp without time zone", {
    name: "earned_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  earnedAt: Date | null;

  @Column("numeric", {
    name: "progress",
    nullable: true,
    precision: 5,
    scale: 2,
  })
  progress: string | null;

  @ManyToOne(() => BadgeModel, (badges) => badges.userBadges)
  @JoinColumn([{ name: "badge_id", referencedColumnName: "id" }])
  badge: BadgeModel;

  @ManyToOne(() => UserModel, (users) => users.userBadges)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: UserModel;
}
