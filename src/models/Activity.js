import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Activity = sequelize.define(
  "Activity",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    instructor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "activities",
    timestamps: true,
  }
);

export default Activity;
