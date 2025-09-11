import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {}
);

Product.associate = (models) => {
  Product.belongsTo(models.Category, {
    foreignKey: "categoryId",
    as: "category",
  });
};

Product.associate = (models) => {
  Product.belongsToMany(models.OrderPurchase, {
    through: models.OrderProduct,
    foreignKey: "orderPurchaseId",
    otherKey: "productId",
    as: "product",
  });
};

export default Product;
