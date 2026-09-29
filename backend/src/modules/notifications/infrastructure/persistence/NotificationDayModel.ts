import { Entity, Column, PrimaryColumn } from "typeorm";

// Indica que esta clase representa la tabla notification_days.
@Entity({ name: "notification_days" })
export class NotificationDayModel {
  // Define notification_id como parte de la clave primaria.
  @PrimaryColumn({
    // Indica que el tipo de dato es entero.
    type: "integer",

    // Indica el nombre de la columna en la base de datos.
    name: "notification_id",
  })
  // Guarda el ID de la notificación.
  notificationId!: number;

  // Define day_of_week como parte de la clave primaria.
  @PrimaryColumn({
    // Indica que el tipo de dato es entero.
    type: "integer",

    // Indica el nombre de la columna en la base de datos.
    name: "day_of_week",
  })
  // Guarda el número del día de la semana.
  dayOfWeek!: number;
}
