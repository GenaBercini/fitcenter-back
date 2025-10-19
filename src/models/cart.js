import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  total: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM("Open", "Pending", "Cancelled", "Paid"),
    defaultValue: "Open",
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  paymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});


export default Cart;
