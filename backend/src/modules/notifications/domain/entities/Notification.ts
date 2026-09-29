// Se define como debe ser la notificación

export interface Notification {
  id: number;
  name: string;
  description: string | null;
  routineId: number | null;
  notificationTime: string | null;
  reminder: boolean;
  reminderMinutes: number | null;
  isActive: boolean;
  days: number[];
}