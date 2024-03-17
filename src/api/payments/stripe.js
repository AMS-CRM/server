const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const controller = require("../../controller/payments/payments");
const bodyParser = require("body-parser");

/**
 *
 * @API     GET /stripe/sessiokn
 * @Desc    Create payments link for strip checkout
 * @Access  Private
 *
 */
router.post(
  "/session",
  protect,
  bodyParser.raw({ type: "application/json" }),
  controller.createSubscriptionLink
);

module.exports = router;
