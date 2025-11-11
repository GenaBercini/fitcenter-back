import stripe from "../../../config/stripe.js";
import Cart from "../../models/Cart.js";
import User from "../../models/User.js";
import ErrorResponse from "../../utils/errorConstructor.js";


const stripeController = {
  stripeWebhook: async (req, res, next) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return next(new ErrorResponse(`Webhook Error: ${err.message}`, 400));
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata || {};
      const paymentIntent = session.payment_intent;

      if (metadata.cartId) {
        const cart = await Cart.findByPk(metadata.cartId);
        if (cart && cart.status === "Pending") {
          cart.status = "Paid";
          cart.paymentDate = new Date();
          cart.paymentIntentId = paymentIntent;
          await cart.save();
        }
      }

      if (metadata.membershipPayment === "true" && metadata.userId) {
        const user = await User.findByPk(metadata.userId);
        if (user) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(startDate.getDate() + 30);

          user.membershipType = "Premium";
          user.membershipStartDate = startDate;
          user.membershipEndDate = endDate;
          await user.save();
        }
      }
    }

    res.json({
        success: true,
        message: "Webhook received",
      });
  },
};

export default stripeController;
