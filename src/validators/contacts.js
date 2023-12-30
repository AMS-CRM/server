const { body } = require("express-validator");

/**
 * Extend the edit user and add subscription with default plan
 **/
const createContact = [
  body("firstName")
    .not()
    .isEmpty()
    .withMessage("First Name is required")
    .trim()
    .escape(),
  body("lastName")
    .not()
    .isEmpty()
    .withMessage("Last Name is required")
    .trim()
    .escape(),
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required to create a new contact"),
  body("dob")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Date of birth is required")
    .trim()
    .escape(),
  body("passport")
    .optional()
    .not()
    .isEmpty()
    .withMessage("passport is required")
    .trim()
    .escape(),
  body("dial_code")
    .not()
    .isEmpty()
    .withMessage("Dial Code is required")
    .trim()
    .escape(),
  body("phone")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Phone is required")
    .trim()
    .escape(),
  body("nationality")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Nationality is required")
    .trim()
    .escape(),
  body("address")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Address is required")
    .trim()
    .escape(),
  body("state")
    .optional()
    .not()
    .isEmpty()
    .withMessage("State is required")
    .trim()
    .escape(),
  body("city")
    .optional()
    .not()
    .isEmpty()
    .withMessage("City	is required")
    .trim()
    .escape(),
  body("postalCode")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Postal Code is required")
    .trim()
    .escape(),
];

const deleteContact = [
  body("_id")
    .not()
    .isEmpty()
    .withMessage("Please provide the contact you want to delete")
    .trim()
    .escape(),
];

module.exports = {
  createContact,
  deleteContact,
};
