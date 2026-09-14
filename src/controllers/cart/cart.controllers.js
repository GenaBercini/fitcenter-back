import Cart from "../../models/cart.js";
import CartItem from "../../models/CartItem.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";
import { calculateCartTotal } from "../../utils/calculateCartTotal.js";
import ErrorResponse from "../../utils/errorConstructor.js";
import stripe from "../../../config/stripe.js";
import { fn, col, literal } from "sequelize";

const cartController = {
  getAllCarts: async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return next(new ErrorResponse("ID de usuario no proporcionado", 400));
      }
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new ErrorResponse("Usuario no encontrado", 404));
      }
      const carts = await Cart.findAll({
        where: { userId },
        include: {
          model: CartItem,
          as: "items",
          include: { model: Product, as: "product" },
        },
      });

      res.status(200).json({
        success: true,
        msg: "Carritos obteniendo con exito",
        data: carts,
      });
    } catch (error) {
      next(error);
    }
  },
  getOrCreateActiveCart: async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return next(new ErrorResponse("ID de usuario no proporcionado", 400));
      }
      let user = await User.findByPk(userId);
      if (!user) {
        return next(new ErrorResponse("Usuario no encontrado", 404));
      }
      let cart = await Cart.findOne({
        where: { userId, status: "Open" },
        include: {
          model: CartItem,
          include: { model: Product, as: "product" },
          as: "items",
        },
      });
      if (!cart) {
        cart = await Cart.create({ userId: userId });
      }
      res.status(201).json({
        success: true,
        msg: "Cart retrieved or created",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  },
  getBestSeller: async (req, res, next) => {
  try {
    const bestSellers = await CartItem.findAll({
      attributes: [
        "productId",
        [fn("SUM", col("quantity")), "totalSold"],
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["name", "price", "img"],
        },
      ],
      group: ["productId", "product.id"],
      order: [[literal("totalSold"), "DESC"]],
      limit: 4,
    });

    res.status(200).json({
      success: true,
      message: "Productos más vendidos obtenidos",
      data: bestSellers,
    });
  } catch (err) {
    next(err);
  }
},
  addToCart: async (req, res, next) => {
    const { idCart } = req.params;
    const { productId } = req.body;

    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        return next(new ErrorResponse("Producto no encontrado", 404));
      }

      const cart = await Cart.findByPk(idCart);
      if (!cart) {
        return next(new ErrorResponse("Carrito no encontrado", 404));
      }

      let item = await CartItem.findOne({
        where: { cartId: cart.id, productId },
      });

      if (item) {
        item.quantity += 1;
        item.subtotal = item.quantity * product.price;
        await item.save();
      } else {
        await CartItem.create({
          cartId: cart.id,
          productId,
          quantity: 1,
          subtotal: product.price,
        });
      }

      await calculateCartTotal(cart.id);

      const updated = await Cart.findByPk(cart.id, {
        include: [
          {
            model: CartItem,
            include: { model: Product, as: "product" },
            as: "items",
          },
        ],
      });

      res.status(201).json({
        success: true,
        msg: "Producto agregado al carrito",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  removeFromCart: async (req, res, next) => {
    try {
      const { idCart } = req.params;
      const { productId, removeAll } = req.body;

      // const cart = await Cart.findByPk(idCart);
      const cart = await Cart.findByPk(idCart, {
        include: { model: CartItem, as: "items" },
      });

      if (cart.status !== "Open") {
        return next(new ErrorResponse("No hay carrito activo", 404));
      }

      const product = await Product.findByPk(productId);

      if (!product) {
        return next(new ErrorResponse("Producto no encontrado", 404));
      }

      const item = await CartItem.findOne({
        where: { cartId: cart.id, productId },
      });

      if (!item) {
        return next(
          new ErrorResponse("Producto no encontrado en el carrito", 404)
        );
      }

      if (removeAll || item.quantity <= 1) {
        await item.destroy();
      } else {
        if (item.quantity > 1) {
          item.quantity -= 1;
          item.subtotal = product.price * item.quantity;
          await item.save();
        } else {
          await item.destroy();
        }
      }

      // if (item.quantity > 1) {
      //   item.quantity -= 1;
      //   item.subtotal = product.price * item.quantity;
      //   await item.save();
      // } else {
      //   await item.destroy();
      // }

      await calculateCartTotal(cart.id);
      const updated = await Cart.findByPk(cart.id, {
        include: { model: CartItem, as: "items" },
      });
      res.status(201).json({
        success: true,
        msg: "Cart updated with product",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  createCheckoutCart: async (req, res, next) => {
    const { userId } = req.params;
    const { cartId } = req.body;

    try {
      const cart = await Cart.findOne({
        where: {
          id: cartId,
          status: "Open",
        },
        include: [
          {
            model: CartItem,
            include: { model: Product, as: "product" },
            as: "items",
          },
        ],
      });

      if (!cart) return next(new ErrorResponse("Carrito no encontrado", 404));

      if (cart.items.length === 0)
        return next(new ErrorResponse("El carrito está vacío", 400));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: cart.items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: { name: item.product.name },
            unit_amount: Math.round(item.product.price * 100),
          },
          quantity: item.quantity,
        })),
        metadata: { cartId: cart.id, userId },
        success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/checkout/cancel`,
      });

      cart.status = "Pending";
      await cart.save();

      res.json({
        success: true,
        message: "Sesión de checkout creada",
        data: { url: session.url },
      });
    } catch (error) {
      next(error);
    }
  },
};

export default cartController;
