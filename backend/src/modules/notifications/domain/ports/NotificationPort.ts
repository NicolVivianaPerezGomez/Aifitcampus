// Se definen las funciones que debe tener cualquier clase que maneje las notificaciones
import { Notification } from "../entities/Notification";

export interface NotificationPort {
  // Crea notificación
  create(notification: Omit<Notification, "id">, days: number[]): Promise<Notification>;
  // Devuelve todas
  findAll(): Promise<Notification[]>;
  // Busca por id
  findById(id: number): Promise<Notification | null>;
  // Actualiza
  update(id: number, notification: Partial<Omit<Notification, "id">>, days?: number[] ): Promise<Notification | null>;
  // Estado
  toggleActive(id: number): Promise<Notification | null>;
  // Notificaciones de un usuario
  findByUserId(userId: number): Promise<Notification[]>;
}