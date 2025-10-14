import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Product from "./Product.js";
import User from "./User.js"; 

const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: User,
        key: "id",
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
        model:Product,
        key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});

// Asociaciones
CartItem.belongsTo(Product, { foreignKey: "productId" });
CartItem.belongsTo(User, { foreignKey: "userId" });

export default CartItem;