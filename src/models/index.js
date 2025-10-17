import Product from './Product.js';
import Category from './Category.js';
import OrderPurchase from './OrderPurchase.js';
import OrderProduct from './OrderProduct.js';

const models = {
  Product,
  Category,
  OrderPurchase,
  OrderProduct,
};

// Ejecutar asociaciones
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

export default models;
