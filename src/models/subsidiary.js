import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

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
