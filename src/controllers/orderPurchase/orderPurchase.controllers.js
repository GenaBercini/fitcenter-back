import OrderPurchase from "../../models/OrderPurchase";
import Product from "../../models/Product";
import Customers from "../../models/Customers";
import { Op } from "sequelize";

const orderPurchaseController = {
  getAllOrderPurchase: async (req, res, next) => {
    try {
      const allOrderPurchase = await OrderPurchase.findAll({
        where: {
          disabled: false,
          status: "enabled",
        },
        include: [
          {
            model: OrderPurchase,
            attributes: ["productId", "name", "price"],
            as: "OrderPurchase",
          },
        ],
      });

      if (!allOrderPurchase.length) {
        return res.status(404).json({
          success: false,
          msg: "No se encontraron ordenes de compra",
        });
      }

      res.status(200).json({
        success: true,
        msg: "Todos las ordenes de compra fueron enviadas",
        data: allOrderPurchase,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },

  getOrderPurchaseById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const orderPurchase = await OrderPurchase.findByPk(id, {
        where: {
          disabled: false,
          status: "enabled",
        },
        include: [
          {
            model: Product,
            attributes: ["productId", "name", "price"],
            as: product,
          },
        ],
        // include: [                    (Esperar a que Rama haga su CRUD de Customer)
        //   {
        //     model: Customer,
        //     attributes: {},
        //     as: customer,
        //   },
        // ],
      });

      if (!orderPurchase) {
        return res.status(404).json({
          success: false,
          msg: "Orden de compra no encontrada",
        });
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },

  updateOrderPurchase: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, quantity } = req.body;
      if (!id) {
        return res.status(400).json({
          success: false,
          msg: "Falta el ID de la orden de compra",
        });
      }

      const orderPurchase = await OrderPurchase.findByPk(id);
      if (!orderPurchase) {
        return res.status(404).json({
          success: false,
          msg: "Orden de compra no encontrada",
        });
      }

      if (!status && !quantity && !orderPurchaseId) {
        return res.status(400).json({
          success: false,
          msg: "No hay información para actualizar",
        });
      }

      const orderPurchaseFounded = await OrderPurchase.findByPk(
        orderPurchaseId
      );

      if (!orderPurchaseFounded) {
        return res.status(404).json({
          success: false,
          msg: "Orden de compra no encontrada",
        });
      }

      await orderPurchase.update({
        status,
        quantity,
      });

      res.status(200).json({
        success: true,
        msg: "Orden de compra actualizada correctamente",
        data: orderPurchase,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },

  createOrderPurchase: async (req, res, next) => {
    try {
      const { status, quantity } = req.body;
      if (!quantity || !status || !orderPurchaseId) {
        return res.status(400).json({
          success: false,
          msg: "Faltan campos obligatorios",
        });
      }

      const orderPurchaseFounded = await OrderPurchase.findByPk(
        orderPurchaseId
      );
      if (!orderPurchaseFounded) {
        return res.status(404).json({
          success: false,
          msg: "Orden de compra no encontrada",
        });
      }

      const OrderPurchase = await OrderPurchase.create({ status });
      for (const item of product) {
        //Esta es la parte de cantidad y precioTotal en la relacion (no estoy seguro si funciona)
        await newOrderPurchase.addProduct(item.productId, {
          through: {
            quantity: item.quantity,
            total: item.quantity * product.price,
          },
        });
      }

      res.status(200).json({
        success: true,
        msg: "Orden de compra creada con éxito",
        data: newOrderPurchase,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },

  statusOrderPurchase: async (req, res) => {
    try {
      const { id } = req.params;
      const { disabled } = req.body;
      if (!id) {
        return res.status(400).json({
          success: false,
          msg: "Falta el ID de la orden de compra",
        });
      }

      if (disabled === undefined) {
        return res.status(400).json({
          success: false,
          msg: "Falta el estado de la orden de compra",
        });
      }

      const orderPurchase = await OrderPurchase.findByPk(id);
      if (!orderPurchase) {
        return res.status(404).json({
          success: false,
          msg: "Orden de compra no encontrado",
        });
      }

      await orderPurchase.update({ disabled });

      res.status(200).json({
        success: true,
        msg: `Estado de la orden de compra actualizada a ${
          disabled ? "deshabilitado" : "habilitado"
        }`,
        data: orderPurchase,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
};

export default orderpurchaseController;
