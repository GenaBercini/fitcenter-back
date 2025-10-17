import dotenv from "dotenv";
dotenv.config();
import express from "express";
import sequelize from "./config/database.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import models from "./src/models/index.js";
import errorHandler from "./src/utils/errorHandler.js";
import categoriesRoutes from "./src/routes/routes.categories.js";
import productsRoutes from "./src/routes/routes.products.js";
import usersRoutes from "./src/routes/routes.users.js";
import administratorsRoutes from "./src/routes/routes.administrators.js";
import clientsRoutes from "./src/routes/routes.clients.js";
import instructorsRoutes from "./src/routes/routes.instructors.js";
import professorsRoutes from "./src/routes/routes.professors.js";
import membershipsRoutes from "./src/routes/routes.memberships.js";
import exercisesRoutes from "./src/routes/routes.exercise.js";
import routinesRoutes from "./src/routes/routes.routines.js";
import scheduleRoutes from "./src/routes/routes.schedule.js";
import subsidiaryRoutes from "./src/routes/routes.subsidiary.js";
import activityRoutes from "./src/routes/routes.activity.js";
import inscriptionRoutes from "./src/routes/routes.inscription.js";
import cartRouter from "./src/routes/routes.cart.js";

dotenv.config();
const swaggerFile = JSON.parse(
  fs.readFileSync("./config/swagger_output.json", "utf-8")
);

const server = express();

server.use("/uploads", express.static("uploads"));

server.use(express.json());
server.set('port', 3000);
server.use(cors({
    origin: '*',
  );
// Middlewares
server.use(express.json({ limit: "10mb" }));
server.use(express.urlencoded({ limit: "10mb", extended: true }));
server.use(cookieParser());
server.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })


// Rutas

server.use("/categories", categoriesRoutes);
server.use("/products", productsRoutes);
server.use("/users", usersRoutes);
server.use("/memberships", membershipsRoutes);
server.use("/schedule", scheduleRoutes);
server.use("/subsidiary", subsidiaryRoutes);
server.use("/exercises", exercisesRoutes);
server.use("/routines", routinesRoutes);
server.use("/activities", activityRoutes);
server.use("/inscription", inscriptionRoutes);
server.use("/cart", cartRouter);

 // Documentacion con Swagger
 server.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  
// Manejador de errores
server.use(errorHandler);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado correctamente a la base de datos');

    await sequelize.sync({ alter: true });
    console.log('🛠️ Modelos sincronizados');

    server.listen(server.get("port"), () => {
      console.log("Servidor corriendo en el puerto", server.get("port"));
    });
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
  }
})();
