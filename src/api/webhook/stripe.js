const express = require("express");
const router = express.Router();
const controller = require("../../controller/webhooks/stripe.js");

/**
 *
 * @API        /webhooks/stripe
 * @Desc       Web hooks to listen to stripe events
 * @Access     Public needs the stripe key
 *
 */
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  controller.stripeWebhook
);

module.exports = router;
