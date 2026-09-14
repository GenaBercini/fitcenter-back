import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import User from "./User.js";

const Routine = sequelize.define(
  "Routine",
  {
    typeRoutine: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descRoutine: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {}
);
Routine.belongsTo(User, { foreignKey: "professorId", as: "professor" });

export default Routine;
