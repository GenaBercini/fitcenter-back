import dotenv from "dotenv";
dotenv.config();
import express from "express";
import sequelize from './config/database.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import errorHandler from "./src/utils/errorHandler.js";
import categoriesRoutes from "./src/routes/routes.categories.js";
import productsRoutes from "./src/routes/routes.products.js";
import usersRoutes from "./src/routes/routes.users.js";
import membershipsRoutes from "./src/routes/routes.memberships.js";
import exercisesRoutes from "./src/routes/routes.exercise.js";
import routinesRoutes from "./src/routes/routes.routines.js";
import bookingRoutes from "./src/routes/routes.booking.js";
import subsidiaryRoutes from "./src/routes/routes.subsidiary.js";

dotenv.config();
const swaggerFile = JSON.parse(fs.readFileSync('./config/swagger_output.json', 'utf-8'));


const server = express();
server.use(express.json());
server.set('port', 3000);
server.use(cors({
    origin: '*',
    credentials: true,
  }));
  
server.use('/categories', categoriesRoutes);
server.use('/products', productsRoutes);
server.use('/users', usersRoutes);
server.use('/memberships', membershipsRoutes);
server.use('/booking', bookingRoutes); 
server.use("/subsidiary", subsidiaryRoutes); 
server.use('/exercises',exercisesRoutes);
server.use('/routines',routinesRoutes);

server.use(express.json({ limit: '10mb' }));
server.use(express.urlencoded({ limit: '10mb', extended: true }));
server.set("port", 3000);
server.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
server.use(cookieParser());
server.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

server.use("/categories", categoriesRoutes);
server.use("/products", productsRoutes);
server.use("/users", usersRoutes);
server.use("/memberships", membershipsRoutes);
server.use("/booking", bookingRoutes);
server.use("/subsidiary", subsidiaryRoutes);
server.use("/exercises", exercisesRoutes);
server.use("/routines", routinesRoutes);
server.use(errorHandler);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado correctamente a la base de datos");

    await sequelize.sync({ alter: true });
    console.log("🛠️ Modelos sincronizados");

    app.listen(app.get("port"), () => {
      console.log("Servidor corriendo en el puerto", app.get("port"));
    });
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error);
  }
})();
