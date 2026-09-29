import { DataSource } from "typeorm";
import dotenv from "dotenv";
import envs from "./environment-vars";

// Modelos de persistencia (mapeo generado con typeorm-model-generator), uno por tabla
import { UserModel } from "../../modules/users/infrastructure/persistence/UserModel";
import { RoleModel } from "../../modules/roles/infrastructure/persistence/RoleModel";
import { AuditModel } from "../../modules/audits/infrastructure/persistence/AuditModel";
import { RoutineModel } from "../../modules/routines/infrastructure/persistence/RoutineModel";
import { RoutineLogModel } from "../../modules/routines/infrastructure/persistence/RoutineLogModel";
import { RoutineTypeModel } from "../../modules/routines/infrastructure/persistence/RoutineTypeModel";
import { ExerciseModel } from "../../modules/exercises/infrastructure/persistence/ExerciseModel";
import { ExerciseCategoryModel } from "../../modules/exercises/infrastructure/persistence/ExerciseCategoryModel";
import { ExerciseRoutineModel } from "../../modules/exercises/infrastructure/persistence/ExerciseRoutineModel";
import { BadgeModel } from "../../modules/badges/infrastructure/persistence/BadgeModel";
import { UserBadgeModel } from "../../modules/badges/infrastructure/persistence/UserBadgeModel";
import { NotificationModel } from "../../modules/notifications/infrastructure/persistence/NotificationModel";
import { NotificationDayModel } from "../../modules/notifications/infrastructure/persistence/NotificationDayModel";
import { UserNotificationModel } from "../../modules/notifications/infrastructure/persistence/UserNotificationModel";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: envs.DB_HOST,
    port: Number(envs.DB_PORT),
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    database: envs.DB_NAME,
    schema: "public",
    synchronize: false, // en producción no se debe alterar el esquema
    logging: true,
    // Todas las entidades relacionadas deben estar aquí, o TypeORM falla al iniciar.
    // Cuando se suba el módulo notifications, agrega NotificationModel a esta lista.
    entities: [
        UserModel, RoleModel, AuditModel,
        RoutineModel, RoutineLogModel, RoutineTypeModel,
        ExerciseModel, ExerciseCategoryModel, ExerciseRoutineModel,
        BadgeModel, UserBadgeModel,
        NotificationModel, NotificationDayModel, UserNotificationModel,
    ],
});

export const connectDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Conectado a la base de datos PostgresSQL");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1);
    }
}
