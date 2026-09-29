import {
  Entity,
  Column,
  PrimaryColumn,
} from "typeorm";

@Entity({ name: "user_notifications" })
export class UserNotificationModel {
  @PrimaryColumn({
    type: "integer",
    name: "user_id",
  })
  userId!: number;

  @PrimaryColumn({
    type: "integer",
    name: "notification_id",
  })
  notificationId!: number;
}