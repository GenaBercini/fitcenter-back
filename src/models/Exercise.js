import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Routine from "./Routine.js";
import User from "./User.js";

const Exercise = sequelize.define(
  "Exercise",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeEx: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {}
);

Exercise.belongsTo(Routine, { foreignKey: "routineId", as: "routine" });
Routine.hasMany(Exercise, { foreignKey: "routineId", as: "exercises" });

Exercise.belongsTo(User, { foreignKey: "professorId", as: "professor" });
export default Exercise;
