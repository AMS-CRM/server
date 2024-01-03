const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const endpointSecret = "whsec_W9KfncgCbF2CSp3oBEPCGIkSxRFNIiaT";

// Stripe webhooks to recoarc a payment
const stripeWebhook = asyncHandler(async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = await stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );
      console.log(event);
    } catch (err) {
      res.status(400).setCode(3423);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    console.log(`Unhandled event type ${event.type}`);

    return res.status(200).setCode(3482).setPayload({}).respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  stripeWebhook,
};
