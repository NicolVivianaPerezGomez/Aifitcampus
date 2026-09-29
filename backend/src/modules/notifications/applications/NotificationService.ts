// Contiene la logica para hacer las operaciones del crud
import { Notification } from "../domain/entities/Notification"; // Representación de como es una notificación
import { NotificationPort } from "../domain/ports/NotificationPort"; // Define que operaciones se pueden hacer

// Creación de la clase
export class NotificationService {
  // Constructor de la clase
  constructor(
    // NotificationPort debe cumplir con lo definido en NotificationPort, valor no cambia después de ser asignado
    private readonly notificationPort: NotificationPort,
  ) {}

  //1. Metodo crear notificación (async: asincrona)
  async create(
    // Recibo la notificación
    notification: Omit<Notification, "id" | "days">,
    days: number[],
  ): Promise<Notification> { // Devolvera una notificación cuando termine
    console.log("Notificación creada:", notification);
    console.log("Días seleccionados:", days);
    // Espera que notificationPort cree la notificación
    return await this.notificationPort.create(
      {
        // operador Spread: copia los datos de la notificación
        ...notification,
        days: [],
      },
      // Se pasan aparte como los días que recibimos en el método
      days,
    );
  }

  // 2. Método para obtener GET
  async findAll(): Promise<Notification[]> {
    // Se pide al repositorio todas las notificaciones
    return await this.notificationPort.findAll();
  }

  // 3. Método para consultar GET
  async findById(id: number): Promise<Notification | null> {
    return await this.notificationPort.findById(id);
  }

  // 4. Método actualizar, partial: Permite modificar algunos campos
  async update( id: number, notification: Partial<Omit<Notification, "id" | "days">>, days?: number[],): 
  Promise<Notification | null> {
    return await this.notificationPort.update(
      id, // Que notificación actualizar
      {
        // operador Spread: datos que queremos modificar
        ...notification,
        days: [],
      },
      days,
    );
  }

  // 5. Método de estado
  async toggleActive(id: number): Promise<Notification | null> {
    return await this.notificationPort.toggleActive(id);
  }

  // Método buscar notificaciones a un usuario especifico
  async findByUserId(userId: number): Promise<Notification[]> {
    return await this.notificationPort.findByUserId(userId); // Busca las notificaciones
  }
}
