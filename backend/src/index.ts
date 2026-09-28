import "reflect-metadata";
import app from "./web/app";
import { ServerBootstrap } from "./bootstrap/server.bootstrap";
import { connectDB } from "./shared/config/data-base";

const serverBootstrap = new ServerBootstrap(app);
(async () => {
    try {
        await connectDB();
        await serverBootstrap.initialize();
    } catch (error) {
        console.log("Error al iniciar la aplicación", error);
        process.exit(1);
    }
})();
