const { body, param } = require("express-validator");
const mongoose = require("mongoose");

// Custom function to check amount
const amountValidationCheck = (amount) => {
  const number = parseInt(amount);
  if (!number) {
    throw new Error("Incorrect amount");
  }
  if (number <= 0) {
    throw new Error("Incorrect amount");
  }
  return true;
};

// Validate the etransfer
const etransfer = [
  body("to").not().isEmpty().withMessage("Provide a valid user"),
  body("payroll").not().isEmpty().withMessage("Payroll ID is required"),
  body("transactionId")
    .not()
    .isEmpty()
    .withMessage("Transaction ID is required"),
  body("securityQuestion")
    .not()
    .isEmpty()
    .withMessage("Provide the security question"),
  body("securityAnswer")
    .not()
    .isEmpty()
    .withMessage("Provide the security answer"),
  body("amount").custom((amount) => amountValidationCheck(amount)),
];

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
  body("amount").custom((amount) => amountValidationCheck(amount)),
];

module.exports = {
  create,
  etransfer,
  transaction,
};
