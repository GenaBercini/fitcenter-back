import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

// ESTE ARCHIVO ASI NO EXISTE HAY Q BORRARLO
const Exercise = sequelize.define(
  "Category",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {}
);

Exercise.associate = (models) => {
  Exercise.hasMany(models.Product, {
    foreignKey: "categoryId",
    as: "products",
  });
};

export default Exercise;
