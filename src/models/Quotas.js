import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Quota = sequelize.define(
  "Quota",
  {
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 30,
      },
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {}
);

// Relacion con Sucursales
Quota.associate = (models) => {
  Quota.belongsTo(models.Branch, {
    foreignKey: "branchId",
    as: "branch",
  });

  // Relacion con turnos
  Quota.belongsToMany(models.Shift, {
    through: models.QuotaShift,
    foreignKey: "quotaId",
    otherKey: "shiftId",
    as: "shifts",
  });
};

export default Quota;
