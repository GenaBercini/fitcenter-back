import sequelize from "../../config/database.js";
import { DataTypes } from "sequelize";

const Subsidiary = sequelize.define(
  "Subsidiary",
  {
    adress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "subsidiary",
    timestamps: false,
  }
);

export default Subsidiary;
