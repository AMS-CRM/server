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
  "/vopay",
  asyncHandler(async (req, res) => {
    const { TransactionID, ValidationKey, Status } = req.body;

    const validationKeyResult = await calculateValidationKey(TransactionID);

    if (ValidationKey != validationKeyResult) {
      res.status(400).setCode(987);
      throw new Error("Validation error");
    }

    // Add the transaction to the database
    const updateTransaction = await transaction.findOneAndUpdate(
      { transactionId: TransactionID },
      {
        status: Status,
      }
    );

    if (!updateTransaction) {
      res.status(400).setCode(385);
      throw new Error("Cannot update the transaction");
    }

    return res.status(200).setCode(43).respond();
  })
);

module.exports = router;
