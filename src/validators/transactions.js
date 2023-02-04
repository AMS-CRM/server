const { body } = require("express-validator");

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
};
