import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Routine from "./Routine.js";
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

Exercise.belongsToMany(Routine, { through: "RoutineExercises" });
Routine.belongsToMany(Exercise, { through: "RoutineExercises" });

export default Exercise;
