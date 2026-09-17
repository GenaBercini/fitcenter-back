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
    professorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
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
