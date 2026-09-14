import sequelize from "../../config/database.js";
import User from "./User.js";
import Product from "./Product.js";
import Cart from "./cart.js";
import CartItem from "./CartItem.js";
import Category from "./Category.js";


User.hasMany(Cart, { foreignKey: "userId", as: "carts" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

Product.hasMany(CartItem, { foreignKey: "productId", as: "items" });
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

Product.belongsTo(Category, {foreignKey: "categoryId",as: "category",})

export default sequelize;
