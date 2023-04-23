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
    .not()
    .isEmpty()
    .withMessage("Date of birth is required")
    .trim()
    .escape(),
  body("passport")
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
    .not()
    .isEmpty()
    .withMessage("Phone is required")
    .trim()
    .escape(),
  body("nationality")
    .not()
    .isEmpty()
    .withMessage("Nationality is required")
    .trim()
    .escape(),
  body("address")
    .not()
    .isEmpty()
    .withMessage("Address is required")
    .trim()
    .escape(),
  body("state")
    .not()
    .isEmpty()
    .withMessage("State is required")
    .trim()
    .escape(),
  body("city").not().isEmpty().withMessage("City	is required").trim().escape(),
  body("postalCode")
    .not()
    .isEmpty()
    .withMessage("Postal Code is required")
    .trim()
    .escape(),
];

// Edit a contact
const editContact = [
  body("user").not().isEmpty().withMessage("User is required"),
  body("payroll.securityQuestion")
    .optional()
    .isString()
    .withMessage("Security question is not valid"),
  body("payroll.securityAnswer").optional().isString(),
  body("payroll.amount")
    .optional()
    .custom((amount) => {
      const number = isNaN(amount);
      if (number) {
        throw new Error("Incorrect amount");
      }
      if (parseInt(amount) <= 0) {
        throw new Error("Incorrect amount");
      }
      return true;
    })
    .toInt(),
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
  editContact,
};
