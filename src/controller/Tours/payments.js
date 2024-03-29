const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(
  process.env.NODE_ENV == "production"
    ? process.env.STRIPE_KEY
    : process.env.STRIPE_TEST_SECRET
);

// Get the model
const BookingModel = require("../../models/bookings.model");
const UserModel = require("../../models/user.model.js");

// Create a user payment
const createBookingPayments = asyncHandler(async (req, res) => {
  try {
    const user = req.user._id;
    const { bookingId } = req.body;

    // Get the bookings payment details
    const bookingPaymentDetails = await BookingModel.findOne(
      {
        _id: bookingId,
        user,
      },
      {
        _id: 0,
        payments: 1,
        user: 1,
      }
    ).populate("user");

    if (!bookingPaymentDetails) {
      res.status(400).setCode(9283);
      throw new Error("Invalid booking");
    }

    // Check if the user is already a customer on stripe
    let userStripeCustomerId =
      bookingPaymentDetails.user.payments.stripeCustomerId ?? null;

    if (!userStripeCustomerId) {
      // Create new stripe customer
      userStripeCustomerId = (
        await stripe.customers.create({
          name: bookingPaymentDetails.user.name,
          email: bookingPaymentDetails.user.email,
        })
      ).id;

      // Create the stripe customer
      const createStripeCustomer = await UserModel.findOneAndUpdate(
        {
          _id: user,
        },
        {
          payments: { stripeCustomerId: userStripeCustomerId },
        }
      );

      if (!createStripeCustomer) {
        res.status(400).setCode(534);
        throw new Error("Something went wrong creating a customer");
      }
    }

    // Create the payment
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {
        customer: userStripeCustomerId,
      },
      { apiVersion: "2020-08-27" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: bookingPaymentDetails.payments.remaningBalance * 100,
      currency: "gbp",
      customer: userStripeCustomerId,
      metadata: {
        bookingId,
      },
    });

    // Strip object
    const payload = {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: userStripeCustomerId,
      publishableKey:
        process.env.NODE_ENV == "production"
          ? process.env.STRIPE_PUBLIC_KEY
          : STRIPE_TEST_KEY,
    };
    // Return the json customer object
    return res.status(200).setPayload(payload).setCode(832).respond();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

module.exports = {
  createBookingPayments,
};
