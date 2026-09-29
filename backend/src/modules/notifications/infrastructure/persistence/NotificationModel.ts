import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// Indica que esta clase representa la tabla "notifications".
@Entity({ name: "notifications" })
export class NotificationModel {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: 150,
  })
  name!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  description!: string | null;

  @Column({
    type: "integer",
    name: "routine_id",
    nullable: true,
  })
  routineId!: number | null;

  @Column({
    type: "time",
    name: "notification_time",
    nullable: true,
  })
  notificationTime!: string | null;

  @Column({
    type: "boolean",
    name: "reminde",
    default: false,
  })
  reminder!: boolean;

  @Column({
    type: "integer",
    name: "reminder_minutes",
    nullable: true,
  })
  reminderMinutes!: number | null;

  @Column({
    type: "boolean",
    name: "is_active",
    default: true,
  })
  isActive!: boolean;
}