const express = require("express");
const router = express.Router();

// For the controller
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const transaction = require("../../models/transaction.model");

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
    try {
      console.log(req.headers);

      const ValidationKey = req.headers["zumrails-signature"];

      let key = process.env.WEBHOOK_KEY;
      let payload = JSON.stringify(req.body);
      var hash = crypto.createHmac("sha256", key).update(payload);

      const validationKeyResult = hash.digest("base64");

      if (ValidationKey != validationKeyResult) {
        res.status(400).setCode(987);
        throw new Error("Validation error");
      }

      console.log("ValidationKey", ValidationKey);
      console.log("validationKeyResult", validationKeyResult);

      console.log(req.body);

      // Add the transaction to the database
      /*const updateTransaction = await transaction.findOneAndUpdate(
        { transactionId: TransactionID },
        {
          status: Status,
        }
      );

      if (!updateTransaction) {
        res.status(400).setCode(385);
        throw new Error("Cannot update the transaction");
      }
      console.log(req.body);

      return res.status(200).setCode(43).respond(); */
    } catch (error) {
      console.log(error);
    }
  })
);

module.exports = router;
