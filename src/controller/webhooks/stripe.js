const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(
  "sk_test_51LOCdKBs87s2ju1LsBTiiwStp5DJOh7zDYXmEWIUD5aM6xGfcc77xQs6xki1xK5n1FRwF2wIMkjEfNd5mfZfmfSb00xtIsKHY2"
);

// Stripe webhooks to record a payment
const stripeWebhook = asyncHandler(async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOKS;
    let event;
    console.log(req.body);
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
        console.log(event.data);

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
