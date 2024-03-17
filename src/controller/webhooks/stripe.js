const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(
  "sk_test_51LOCdKBs87s2ju1LsBTiiwStp5DJOh7zDYXmEWIUD5aM6xGfcc77xQs6xki1xK5n1FRwF2wIMkjEfNd5mfZfmfSb00xtIsKHY2"
);
const subscriptionModel = require("../../models/subscriptions.model");

// Stripe webhooks to record a payment
const stripeWebhook = asyncHandler(async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOKS;
    let event;
    try {
      event = await stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );
    } catch (err) {
      res.status(400).setCode(3423);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        // Enable the user subscription
        const data = event.data;

        // Record a new payments
        const createSubscription = await subscriptionModel.create({
          user: req.user._id,
          $push: {
            method: "Stripe",
            amount: data.object.amount_total,
            transctionID: data.oibject.id,
          },
        });

        if (!createSubscription) {
          throw new Error("Unable to create a new subscription");
        }

        return res.status(200).setCode(342).setPayload({}).respond();

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(200).setCode(3482).setPayload({}).respond();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

module.exports = {
  stripeWebhook,
};
