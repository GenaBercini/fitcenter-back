import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Activity from "./activities.js";

const Inscription = sequelize.define(
  "Inscription",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Activity,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "inscriptions",
    timestamps: true,
  }
);

// Relación
Activity.hasMany(Inscription, { foreignKey: "activityId" });
Inscription.belongsTo(Activity, { foreignKey: "activityId" });

export default Inscription;
