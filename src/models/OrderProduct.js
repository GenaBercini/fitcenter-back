import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const OrderProduct = sequelize.define("OrderProduct", {
  orderId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },

  productId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },

  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default OrderProduct;
