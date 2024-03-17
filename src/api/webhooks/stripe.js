const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const controller = require("../../controller/webhooks/stripe");
const bodyParser = require("body-parser");

/**
 *
 * @API     GET /stripe/sessiokn
 * @Desc    Create payments link for strip checkout
 * @Access  Private
 *
 */
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  controller.stripeWebhook
);

module.exports = router;
