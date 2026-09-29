// Recibe la petición HTTP, llama al Service y devuelve la respuesta al usuario.
import { Request, Response } from "express";
import { NotificationService } from "../../applications/NotificationService";
import { NotificationAdapter } from "../adapters/NotificationAdapter";
import { AuthRequest } from "../../../../shared/middleware/auth.middleware"; // Acceder al usuario autenticado

export class NotificationController {
  // Guarda una instancia del servicio de notificaciones
  private readonly notificationService: NotificationService;

  constructor() {
    // Crea el Adapter
    const notificationAdapter = new NotificationAdapter();
    // Le pasa el Adapter al Service
    this.notificationService = new NotificationService(notificationAdapter);
  }

  // Crear una notificación
  async create(req: Request, res: Response): Promise<void> {
    try {
      console.log("Recibido:", req.body); // Muestra en consola los datos enviados en la petición.
      console.log("Header:", req.headers); //Muestra los encabezados de la petición.

      //Extrae del body los datos necesarios para crear la notificación.
      const {
        name,
        description,
        routineId,
        notificationTime,
        reminder,
        reminderMinutes,
        isActive,
        days,
      } = req.body ?? {};

      // Muestra los datos de la notificación en consola.
      console.log("DATOS DE NOTIFICACIÓN:", {
        name,
        description,
        routineId,
        notificationTime,
        reminder,
        reminderMinutes,
        isActive,
        days,
      });

      // Llama al Service para crear la notificación.
      const notification = await this.notificationService.create(
        {
          name,
          description,
          routineId,
          notificationTime,
          reminder,
          reminderMinutes,
          isActive,
        },
        days,
      );

      // Devuelve código 201 indicando que fue creada.
      res.status(201).json({
        // Mensaje de confirmación.
        message: "Notificación creada correctamente",

        // Devuelve la notificación con los días formateados.
        data: this.formatNotification(notification),
      });
    } catch (error) {
      // Muestra el error en consola.
      console.error("Error al crear notificación:", error);

      // Devuelve código 500 por error del servidor.
      res.status(500).json({
        message: "Error al crear la notificación",
      });
    }
  }

  // Obtener todas las notificaciones.
  async findAll(req: Request, res: Response): Promise<void> {
    // Muestra que este método fue ejecutado.
    console.log("ENTRÓ A FIND ALL");

    try {
      // Pide al Service todas las notificaciones.
      const notifications = await this.notificationService.findAll();

      // Devuelve código 200 indicando que la consulta fue exitosa.
      res.status(200).json({
        // Recorre las notificaciones y formatea sus días.
        data: notifications.map((notification) =>
          this.formatNotification(notification),
        ),
      });
    } catch (error) {
      // Muestra el error en consola.
      console.error("Error al obtener notificaciones:", error);

      // Devuelve código 500 por error del servidor.
      res.status(500).json({
        message: "Error al obtener las notificaciones",
      });
    }
  }

  // Obtener una notificación por ID.
  async findById(req: Request, res: Response): Promise<void> {
    // Muestra que se ejecutó la búsqueda por ID.
    console.log("ENTRÓ A FIND BY ID");

    // Muestra la URL recibida.
    console.log("URL:", req.originalUrl);

    // Muestra los parámetros recibidos.
    console.log("PARAMS:", req.params);

    try {
      // Convierte el ID recibido en la URL de texto a número.
      const id = Number(req.params.id);

      // Busca la notificación mediante el Service.
      const notification = await this.notificationService.findById(id);

      // Verifica si la notificación no existe.
      if (!notification) {
        // Devuelve código 404 porque no fue encontrada.
        res.status(404).json({
          message: "Notificación no encontrada",
        });

        // Termina la ejecución.
        return;
      }

      // Devuelve código 200 porque fue encontrada.
      res.status(200).json({
        // Devuelve la notificación con los días formateados.
        data: this.formatNotification(notification),
      });
    } catch (error) {
      // Muestra el error en consola.
      console.error("Error al obtener la notificación:", error);

      // Devuelve código 500 por error del servidor.
      res.status(500).json({
        message: "Error al obtener la notificación",
      });
    }
  }

  // Actualizar una notificación.
  async update(req: Request, res: Response): Promise<void> {
    try {
      // Obtiene el ID de la URL y lo convierte a número.
      const id = Number(req.params.id);

      // Extrae del body los datos que pueden actualizarse.
      const {
        name,
        description,
        routineId,
        notificationTime,
        reminder,
        reminderMinutes,
        isActive,
        days,
      } = req.body;

      // Envía los datos al Service para actualizar.
      const notification = await this.notificationService.update(
        id,
        {
          name,
          description,
          routineId,
          notificationTime,
          reminder,
          reminderMinutes,
          isActive,
        },
        days,
      );

      // Verifica si la notificación no existe.
      if (!notification) {
        // Devuelve código 404 porque no fue encontrada.
        res.status(404).json({ message: "Notificación no encontrada" });
        // Termina la ejecución.
        return;
      }
      // Devuelve código 200 indicando que fue actualizada.
      res.status(200).json({
        // Mensaje de confirmación.
        message: "Notificación actualizada correctamente",

        // Devuelve la notificación actualizada.
        data: this.formatNotification(notification),
      });
    } catch (error) {
      // Muestra el error en consola.
      console.error("Error al actualizar notificación:", error);

      // Devuelve código 500 por error del servidor.
      res.status(500).json({
        message: "Error al actualizar la notificación",
      });
    }
  }

  // Activar o desactivar una notificación.
  async toggleActive(req: Request, res: Response): Promise<void> {
    try {
      // Obtiene el ID de la URL y lo convierte a número.
      const id = Number(req.params.id);
      // Llama al Service para cambiar el estado.
      const notification = await this.notificationService.toggleActive(id);
      // Verifica si la notificación no existe.
      if (!notification) {
        // Devuelve código 404 porque no fue encontrada.
        res.status(404).json({
          message: "Notificación no encontrada",
        });

        // Termina la ejecución.
        return;
      }

      // Devuelve código 200 indicando que el cambio fue exitoso.
      res.status(200).json({
        // Si está activa muestra "activada"; si no, "desactivada".
        message: notification.isActive
          ? "Notificación activada correctamente"
          : "Notificación desactivada correctamente",

        // Devuelve la notificación actualizada.
        data: this.formatNotification(notification),
      });
    } catch (error) {
      // Muestra el error en consola.
      console.error("Error al cambiar estado de notificación:", error);

      // Devuelve código 500 por error del servidor.
      res.status(500).json({
        message: "Error al cambiar el estado de la notificación",
      });
    }
  }

  // Obtener las notificaciones del estudiante autenticado.
  async myNotifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Obtiene el ID del usuario desde el token autenticado.
      const userId = req.user?.userId;

      // Verifica que exista un usuario autenticado.
      if (!userId) {
        // Devuelve código 401 porque no está autenticado.
        res.status(401).json({
          message: "Usuario no autenticado",
        });

        // Termina la ejecución.
        return;
      }

      // Busca las notificaciones asociadas al usuario.
      const notifications = await this.notificationService.findByUserId(userId);

      // Devuelve código 200 con las notificaciones.
      res.status(200).json({
        // Recorre y convierte los días a nombres.
        data: notifications.map((notification) =>
          this.formatNotification(notification),
        ),
      });
    } catch (error) {
      // Muestra el error en consola.
      console.error("Error al obtener notificaciones del usuario:", error);

      // Devuelve código 500 por error del servidor.
      res.status(500).json({
        message: "Error al obtener las notificaciones del usuario",
      });
    }
  }

  // Convertir los números de los días a nombres en español.
  private formatNotification(notification: any) {
    // Relaciona cada número con el nombre del día.
    const dayNames: Record<number, string> = {
      1: "lunes",
      2: "martes",
      3: "miércoles",
      4: "jueves",
      5: "viernes",
      6: "sábado",
      7: "domingo",
    };

    // Devuelve la notificación modificando solamente los días.
    return {
      // Copia todos los datos de la notificación.
      ...notification,

      // Convierte los números de los días a nombres.
      days: notification.days.map((day: number) => dayNames[day]),
    };
  }
}
