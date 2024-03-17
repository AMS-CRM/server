const asyncHandler = require("express-async-handler");
const userModel = require("../../models/user.model");
const subscriptionModel = require("../../models/subscriptions.model");
const Stripe = require("stripe")(
  "sk_test_51LOCdKBs87s2ju1LsBTiiwStp5DJOh7zDYXmEWIUD5aM6xGfcc77xQs6xki1xK5n1FRwF2wIMkjEfNd5mfZfmfSb00xtIsKHY2"
);

// Create a a subscription link
const createSubscriptionLink = asyncHandler(async (req, res) => {
  try {
    // Create a subscription link
    const createSubscription = await Stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      mode: "payment",
      metadata: {
        email: req.user.email,
        customerId: req.user._id,
      },
      line_items: [
        {
          price: process.env.ONE_TIME_PLAN,
          quantity: 1,
        },
      ],
      success_url: `${process.env.DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}?canceled=true`,
    });

    return res
      .status(200)
      .setCode(234)
      .setPayload(createSubscription)
      .respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createSubscriptionLink,
};
