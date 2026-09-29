// Conectar la logica de notificaciones con la base de datos

import { In, Repository } from "typeorm";
import { AppDataSource } from "../../../../shared/config/data-base";
import { NotificationModel } from "../persistence/NotificationModel";
import { NotificationDayModel } from "../persistence/NotificationDayModel";
import { UserNotificationModel } from "../persistence/UserNotificationModel";
import { NotificationPort } from "../../domain/ports/NotificationPort";
import { Notification } from "../../domain/entities/Notification";


export class NotificationAdapter {

  // Obtener repositorios, get permite obtenerlos como propiedad
  private get notificationRepo(): Repository<NotificationModel> {
    // Se obtiene desde el TypeORM (Herramienta para trabajar con la base de datos usando código, sin tener que escribir SQL)
    return AppDataSource.getRepository(NotificationModel);
  }
  private get dayRepo(): Repository<NotificationDayModel> {
    return AppDataSource.getRepository(NotificationDayModel);
  }
  private get userNotificationRepo(): Repository<UserNotificationModel> {
    return AppDataSource.getRepository(UserNotificationModel);
  }

  // 1. Método para convertir los datos
  private toDomain(
    // Recibe la notificación de la bd
    model: NotificationModel, 
    days: number[]
  ): Notification { // Devuelve notificación del dominio
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      routineId: model.routineId,
      notificationTime: model.notificationTime,
      reminder: model.reminder,
      reminderMinutes: model.reminderMinutes,
      isActive: model.isActive,
      days: days,
    };
  }

  // 2. Método para crear
  async create( notification: Omit<Notification, "id">,days: number[]): 
  Promise<Notification> { // Al terminar devuelve notificación

    // Entidad vacia
    const entity = new NotificationModel();

    // Se asignan los datos uno por uno
    entity.name = notification.name; // Copia el nombre recibido de la entidad
    entity.description = notification.description ?? null;
    entity.routineId = notification.routineId ?? null;
    entity.notificationTime = notification.notificationTime ?? null; // Hora
    entity.reminder = notification.reminder ?? false; // Recordatorio
    entity.reminderMinutes = notification.reminderMinutes ?? null; // Minutos del recordatorio
    entity.isActive = notification.isActive ?? true; // Si no viene el valor por defecto queda activa

    // Guarda la notificación (saved resultado que guarda en la bd)
    const saved = await this.notificationRepo.save(entity);

    // Guarda los días
    for (const day of days) {
      // Crea un objeto vacio para representar el día que se va guardando
      const dayEntity = new NotificationDayModel();
      // Indica que pertence a ese día la notificación
      dayEntity.notificationId = saved.id;
      // Guarda que dia de la semana es 
      dayEntity.dayOfWeek = day;
      // Guarda el dia en la bd
      await this.dayRepo.save(dayEntity);
    }
    // Convierte toDomain en el formato de notificación
    return this.toDomain(
      saved,
      days
    );
  }

  // 3. Método para listar todas las notificaciones
  async findAll(): Promise<Notification[]> {
     // Busca todas las notificaciones (TypeORM) en la base de datos
    const notifications = await this.notificationRepo.find();
    // Crea una lista vacía donde se guardarán las notificaciones
    const result: Notification[] = [];

    // Recorre todas las notificaciones encontradas
    for (const notification of notifications) {

      // Busca los días que pertenecen a cada notificación
      const dayRows = await this.dayRepo.find({where: {notificationId: notification.id,},});
      // Obtiene solamente el número del dia de cada registrp
      const days = dayRows.map((day) => day.dayOfWeek);
      // Convierte la notificación al formato del dominio y la agrega a la lista de resultados
      result.push(this.toDomain(notification,days));
    }
    return result; // Devuelve la lista de todas las notificaciones
  }

  // 4. Método para buscar una notificación por su ID
  async findById(id: number): Promise<Notification | null> {

    // Busca la notificación por su ID
    const notification = await this.notificationRepo.findOneBy({id});

    // Si no existe la notificación, devuelve null
    if (!notification) {
      return null;
    }
    //Busca los días que pertenecen a esa notificación (where: condición)
    const dayRows = await this.dayRepo.find({where: {notificationId: id, },});
    // Obtiene solamente los números de los días
    const days = dayRows.map((day) => day.dayOfWeek);
    // Convierte la notificación al formato del dominio y devuelve la notificación
    return this.toDomain(notification,days);
  }

  // // 5. Método para actualizar
  async update(id: number,notification: Partial<Omit<Notification, "id">>,days?: number[]): 
  Promise<Notification | null> {

    // Busca la notificación que se quiere actualizar
    const entity = await this.notificationRepo.findOneBy({id,});
      // Si no existe, devuelve null
    if (!entity) {
      return null;
    }


    // Actualiza solamente el nombre si fue enviado 
    if (notification.name !== undefined) {
      entity.name = notification.name;
    }

    if (notification.description !== undefined) {
      entity.description =
        notification.description;
    }

    if (notification.routineId !== undefined) {
      entity.routineId =
        notification.routineId;
    }

    if (notification.notificationTime !== undefined) {
      entity.notificationTime =
        notification.notificationTime;
    }

    if (notification.reminder !== undefined) {
      entity.reminder =
        notification.reminder;
    }

    if (notification.reminderMinutes !== undefined) {
      entity.reminderMinutes =
        notification.reminderMinutes;
    }

    if (notification.isActive !== undefined) {
      entity.isActive =
        notification.isActive;
    }

    // Guarda los cambios de la notificación
    const updated = await this.notificationRepo.save(entity );

    // Si se enviaron días, se actualizan los días anteriores
    if (days !== undefined) {
      // Elimina los días anteriores de esa notificación
      await this.dayRepo.delete({notificationId: id,});

       // Recorre los nuevos días
      for (const day of days) {

        // Crea un objeto para guardar el nuevo día
        const dayEntity = new NotificationDayModel();
        // Relaciona el día con la notificación
        dayEntity.notificationId = id;
        // Guarda el número del día
        dayEntity.dayOfWeek = day;
        // Guarda el día en la base de datos
        await this.dayRepo.save(dayEntity);
      }
    }
    // Busca nuevamente la notificación para devolverla ya actualizada
    return this.findById(id);
  }

  // 6. Método para activar o desactivar una notificación
  async toggleActive(id: number): Promise<Notification | null> {

    // Busca la notificación por su ID
    const notification = await this.notificationRepo.findOneBy({ id,});

     // Si no existe, devuelve null
    if (!notification) {
      return null;
    }

    // Cambia el estado:true pasa a false y false pasa a true
    notification.isActive = !notification.isActive;

    // Guarda el nuevo estado en la base de datos
    const updated = await this.notificationRepo.save(notification);
    // Busca los días de la notificación
    const dayRows = await this.dayRepo.find({where: {notificationId: id,},});
    // Obtiene los números de los días
    const days = dayRows.map((day) => day.dayOfWeek);
    // Convierte y devuelve la notificación actualizada
    return this.toDomain(updated,days);
  }

  // 7. Método para obtener las notificaciones de un usuario
  async findByUserId(userId: number): Promise<Notification[]> {
     // Busca las relaciones entre el usuario y sus notificaciones
    const userNotifications = await this.userNotificationRepo.find({where: {userId,},});
    // Obtiene los IDs de las notificaciones del usuario
    const notificationIds = userNotifications.map((userNotification) => userNotification.notificationId);

     // Si el usuario no tiene notificaciones devuelve una lista vacía
    if (notificationIds.length === 0) {
      return [];
    }
    // Busca las notificaciones del usuario y solamente trae las que están activas
    const notifications = await this.notificationRepo.find({where: {id: In(notificationIds),isActive: true,},});
    // Crea una lista vacía para guardar los resultados
    const result: Notification[] = [];

    // Recorre las notificaciones encontradas
    for (const notification of notifications) {
      // Busca los días de cada notificación
      const dayRows =await this.dayRepo.find({where: {notificationId:notification.id,},});
       // Obtiene solamente los números de los días
      const days =dayRows.map((day) => day.dayOfWeek);
      // Convierte la notificación al formato del dominio y la agrega a la lista
      result.push(this.toDomain(notification,days));
    }
    // Devuelve las notificaciones del usuario
    return result;
  }
}