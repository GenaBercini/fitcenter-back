import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: { min: 1 },
  },
  subtotal: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});


export default CartItem;
