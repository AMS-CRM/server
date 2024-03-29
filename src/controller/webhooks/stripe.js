const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(
  process.env.NODE_ENV == "production"
    ? process.env.STRIPE_KEY
    : process.env.STRIPE_TEST_SECRET
);
const recordPayment = require("../../utils/recordPayment");
// Stripe webhooks to record a payment
const stripeWebhook = asyncHandler(async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const endpointSecret =
      process.env.NODE_ENV == "production"
        ? process.env.STRIPE_WEBHOOKS
        : process.env.STRIPE_TEST_WEBHOOK;
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
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log("payment recorded 2");

        const recordNewPayment = await recordPayment({
          bookingId: paymentIntentSucceeded.metadata.bookingId,
          paymentMethod: "Stripe",
          amount: paymentIntentSucceeded.amount_received / 100,
          status: "Completed",
          reference: paymentIntentSucceeded._id,
        });
        console.log("payment recorded");
        console.log(recordNewPayment);

        if (!recordNewPayment) {
          res.status(400).setCode(13438);
          throw new Error(recordNewPayment);
        }

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
