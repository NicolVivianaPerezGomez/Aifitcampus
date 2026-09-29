import { Router } from "express";
import { NotificationController } from "../controller/NotificationController";
import { authMiddleware } from "../../../../shared/middleware/auth.middleware";
import { adminMiddleware } from "../../../../shared/middleware/admin.middleware";

// Crea un Router para las rutas de notificaciones.
const router = Router();

// Crea una instancia del Controller.
const notificationController = new NotificationController();

// Crear una notificación - solo administrador.
router.post(
  // Ruta para crear una notificación.
  "/",

  // Primero verifica que el usuario esté autenticado.
  authMiddleware,

  // Después verifica que sea administrador.
  adminMiddleware,

  // Ejecuta el método create del Controller.
  notificationController.create.bind(notificationController),
);

// Obtener todas las notificaciones - solo administrador.
router.get(
  // Ruta para consultar todas las notificaciones.
  "/",

  // Verifica que el usuario esté autenticado.
  authMiddleware,

  // Verifica que sea administrador.
  adminMiddleware,

  // Ejecuta el método findAll del Controller.
  notificationController.findAll.bind(notificationController),
);

// Obtener notificaciones del estudiante autenticado.
router.get(
  // Ruta para consultar las notificaciones del usuario.
  "/my-notifications",

  // Verifica que el usuario esté autenticado.
  authMiddleware,

  // Ejecuta el método myNotifications del Controller.
  notificationController.myNotifications.bind(notificationController),
);

// Obtener una notificación por ID - solo administrador.
router.get(
  // ":id" representa el ID de la notificación.
  "/:id",

  // Verifica que el usuario esté autenticado.
  authMiddleware,

  // Verifica que sea administrador.
  adminMiddleware,

  // Ejecuta el método findById del Controller.
  notificationController.findById.bind(notificationController),
);

// Actualizar una notificación - solo administrador.
router.put(
  // Ruta para actualizar una notificación específica.
  "/:id",

  // Verifica que el usuario esté autenticado.
  authMiddleware,

  // Verifica que sea administrador.
  adminMiddleware,

  // Ejecuta el método update del Controller.
  notificationController.update.bind(notificationController),
);

// Activar/Desactivar una notificación - solo administrador.
router.patch(
  // Ruta para cambiar el estado de una notificación.
  "/:id/toggle",

  // Verifica que el usuario esté autenticado.
  authMiddleware,

  // Verifica que sea administrador.
  adminMiddleware,

  // Ejecuta el método toggleActive del Controller.
  notificationController.toggleActive.bind(notificationController),
);

// Exporta las rutas para poder utilizarlas en la aplicación.
export default router;
