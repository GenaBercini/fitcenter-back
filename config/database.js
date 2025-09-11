import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // Nombre de la base de datos
  process.env.DB_USER, // Usuario
  process.env.DB_PASSWORD, // Contraseña
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // Desactiva logs SQL, poner true si querés debug
  }
);

export default sequelize;
