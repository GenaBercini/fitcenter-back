import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';

export const calculateCartTotal = async (cartId) => {
  const items = await CartItem.findAll({ where: { cartId } });
  const total = items.reduce((acc, i) => acc + i.subtotal, 0);
  await Cart.update({ total }, { where: { id: cartId } });
};

