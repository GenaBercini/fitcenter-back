import stripe from "../../../config/stripe.js";
import Cart from "../../models/Cart.js";
import User from "../../models/User.js";
import ErrorResponse from "../../utils/errorConstructor.js";
import MembershipPayment from "../../models/MembershipPayment.js";

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
    }

    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object;

      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      const metadata = subscription.metadata || {};

      console.log("METADATA DE SUBSCRIPCIÓN:", metadata);

      if (metadata.membershipPayment === "true" && metadata.userId) {
        const user = await User.findByPk(metadata.userId);

        if (user) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(startDate.getDate() + 30);

          user.membershipType = metadata.membershipType;
          user.membershipStartDate = startDate;
          user.membershipEndDate = endDate;

          await user.save();

          await MembershipPayment.findOrCreate({
            where: { stripeInvoiceId: invoice.id },
            defaults: {
              userId: Number(metadata.userId),
              membershipType: metadata.membershipType,
              amount: invoice.amount_paid || 0,
              currency: invoice.currency || "ars",
              status: "Paid",
              paymentDate: new Date(invoice.status_transitions?.paid_at
                ? invoice.status_transitions.paid_at * 1000
                : Date.now()),
              paymentIntentId:
                typeof invoice.payment_intent === "string"
                  ? invoice.payment_intent
                  : invoice.payment_intent?.id || null,
            },
          });
        }
      }
    }

    res.json({
      success: true,
      message: "Webhook received"
    });
  },
};

export default stripeController;
