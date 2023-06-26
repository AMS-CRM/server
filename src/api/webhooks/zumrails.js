const express = require("express");
const router = express.Router();

// For the controller
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const transaction = require("../../models/transaction.model");

// Function to calculate the vopay validation key
const calculateValidationKey = async (TransactionID) => {
  return await crypto
    .createHash("sha1")
    .update(`${process.env.VOPAY_SECRET}${TransactionID}`)
    .digest("hex");
};

/**
 *
 * @API     POST /webhooks/vopay
 * @Desc    Get the event updates from vopay
 * @access  Key protected
 *
 */
router.post(
  "/zumrails",
  asyncHandler(async (req, res) => {
    console.log(req.body);

    return res.status(200).setCode(43).respond();
  })
);

module.exports = router;
