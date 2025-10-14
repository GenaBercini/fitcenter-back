import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Activity from "./Activities.js";
import Schedule from "./Schedule.js";
import User from "./User.js";

const Inscription = sequelize.define(
  "Inscription",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("activity", "schedule"),
      allowNull: false,
    },
  },
  {
    tableName: "inscriptions",
    timestamps: true,
  }
);

// Associations
User.hasMany(Inscription, { foreignKey: "userId" });
Inscription.belongsTo(User, { foreignKey: "userId" });

Activity.hasMany(Inscription, { foreignKey: "activityId" });
Inscription.belongsTo(Activity, { foreignKey: "activityId" });

Schedule.hasMany(Inscription, { foreignKey: "scheduleId" });
Inscription.belongsTo(Schedule, { foreignKey: "scheduleId" });

export default Inscription;
