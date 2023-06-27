const { body, param } = require("express-validator");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const checkNumValue = require("../utils/checkNumValue");

// Validate the etransfer
const etransfer = [
  body("to").not().isEmpty().withMessage("Provide a valid user"),
  body("payroll").not().isEmpty().withMessage("Payroll ID is required"),
  body("transferMethod")
    .not()
    .isEmpty()
    .withMessage("Transfer method is required")
    .custom((transferMethod) => {
      if (
        transferMethod != "Direct Deposit" &&
        transferMethod != "E-transfer"
      ) {
        throw new Error("Invalid method type");
      }

      return true;
    }),
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
  body("amount").custom((amount) => checkNumValue(amount)),
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
  body("amount").custom((amount) => checkNumValue(amount)),
];

// Validator for getting the list of transactions
const list = [
  body("page").optional().isNumeric().withMessage("Page should be a string"),
  body("status").optional().isString().withMessage("Status should be a string"),
  body("payroll")
    .optional()
    .isString()
    .withMessage("Payroll should be a string"),
];

module.exports = {
  create,
  etransfer,
  list,
  transaction,
};
