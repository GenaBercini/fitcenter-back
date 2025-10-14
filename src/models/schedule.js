// import { DataTypes } from "sequelize"; // Importa DataTypes de Sequelize
// import sequelize from "../../config/database.js"; // Importa la instancia de Sequelize

// const Booking = sequelize.define(
//   "Booking",
//   {
//     // Define el modelo Turnos

//     activity: {
//       type: DataTypes.STRING, // Define el campo actividad como tipo STRING
//       allowNull: false, // No permite valores nulos
//     },
//     entry: {
//       type: DataTypes.STRING, // Define el campo horarioEntra como tipo STRING
//       allowNull: false, // No permite valores nulos
//     },
//     exit: {
//       type: DataTypes.STRING, // Define el campo horarioSal como tipo STRING
//       allowNull: false, // No permite valores nulos
//     },
//   },
//   {
//     tableName: "booking", // Especifica el nombre de la tabla en la base de datos
//     timestamps: false, // Desactiva los timestamps (createdAt, updatedAt)
//   }
// );

// export default Booking; // Exporta el modelo Turnos para usarlo en otros archivos

// import { DataTypes } from "sequelize";
// import sequelize from "../config/database.js";

// const booking = sequelize.define("Booking", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   dia: {
//     type: DataTypes.DATEONLY, // solo fecha (YYYY-MM-DD)
//     allowNull: false,
//   },
//   horaEntrada: {
//     type: DataTypes.TIME, // hora de inicio
//     allowNull: false,
//   },
//   horaSalida: {
//     type: DataTypes.TIME, // hora de fin
//     allowNull: false,
//   },
//   cupo: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   profesor: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

// export default booking;

import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Schedule = sequelize.define(
  "Schedule",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    day: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "schedules",
    timestamps: true, // createdAt & updatedAt
  }
);

export default Schedule;
