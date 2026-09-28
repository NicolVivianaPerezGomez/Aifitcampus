import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import envs from "../shared/config/environment-vars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import userRoutes from "../modules/users/infrastructure/routes/UserRoutes";
import roleRoutes from "../modules/roles/infrastructure/routes/RoleRoutes";
import exerciseRoutes from "../modules/exercises/infrastructure/routes/ExerciseRoutes";
import badgeRoutes from "../modules/badges/infrastructure/routes/BadgeRoutes";
import routineRoutes from "../modules/routines/infrastructure/routes/RoutineRoutes";

import { errorHandler } from "../shared/middleware/error-handler.middleware";

// NOTA: notifications sigue pendiente; se agrega aquí cuando se implemente.
// EP03 (Áreas) no tiene módulo/rutas propias: el diagrama aprobado no tiene
// tabla `areas`, así que se maneja como parte de `user` (ver /users/:id/department).

class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.app.use(errorHandler);
  }

  private middlewares(): void {
    this.app.use(
      cors({
        origin: envs.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    this.app.use(express.json());
    // Servir archivos estáticos (videos de ejercicios)
    this.app.use("/videos", express.static(path.join(__dirname, "../videos")));
  }

  private routes(): void {
    this.app.use("/api", userRoutes); // EP01 + EP03 (department)
    this.app.use("/api", roleRoutes); // EP02
    this.app.use("/api", exerciseRoutes); // Ejercicios (por video) y categorías
    this.app.use("/api", badgeRoutes); // Insignias
    this.app.use("/api", routineRoutes); // Rutinas, tipos de rutina e historial
  }

  getApp() {
    return this.app;
  }
}

export default new App().getApp();
