const { body, param } = require("express-validator");
const mongoose = require("mongoose");

// Validtor for a single transaction
const transaction = [
  param("transferId")
    .exists()
    .withMessage("Transfer ID is not valid")
    .custom((transferId) => {
      if (!mongoose.Types.ObjectId.isValid(transferId)) {
        throw new Error("Transfers Id is not valid");
      }
      return true;
    }),
];

// Validator for creating a transaction
const create = [
  body("amount").not().isEmpty().trim().escape(),
  body("to")
    .not()
    .isEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .trim()
    .escape(),
  body("amount").custom((amount) => {
    if (!parseInt(amount)) {
      throw new Error("Incorrect amount");
    }
    return true;
  }),
];

module.exports = {
  create,
  transaction,
};
