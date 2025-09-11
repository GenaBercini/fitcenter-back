import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const OrderPurchase = sequelize.define("OrderPurchase", {
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

OrderPurchase.associate = (models) => {
  OrderPurchase.belongsTo(models.Customers, {
    foreignKey: "customersId",
    as: "customers",
  });
};

OrderPurchase.associate = (models) => {
  OrderPurchase.belongsToMany(models.Product, {
    through: models.OrderProduct,
    foreignKey: "orderPurchaseId",
    otherKey: "productId",
    as: "product",
  });
};

export default OrderPurchase;
