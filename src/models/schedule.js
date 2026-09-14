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
    maxCapacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "schedules",
    timestamps: true, // createdAt & updatedAt
  }
);

export default Schedule;
