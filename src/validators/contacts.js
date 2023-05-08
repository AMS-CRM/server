const { body, param } = require("express-validator");

// Validation custom function to check if the given amount is corrent number
const checkNumValue = (numValue) => {
  const number = isNaN(numValue);
  if (number) {
    throw new Error("Incorrect amount");
  }
  if (parseInt(numValue) <= 0) {
    throw new Error("Incorrect amount");
  }
  return true;
};

const getContactWithEmail = [
  param("email").not().isEmpty().withMessage("Email address is required"),
];

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
  body("employeeId")
    .not()
    .isEmpty()
    .withMessage("Employee ID is required")
    .trim()
    .escape(),
  body("hourlyWage")
    .not()
    .isEmpty()
    .custom((amount) => checkNumValue(amount))
    .withMessage("Hourly wage is required")
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
  body("salary.wage")
    .optional()
    .custom((amount) => checkNumValue(amount))
    .toFloat(),
  body("payroll.hours")
    .optional()
    .custom((amount) => checkNumValue(amount))
    .toFloat(),
  body("salary.payCycle")
    .optional()

    .isString()
    .withMessage("Invalid value"),
  body("payroll.extraPay")
    .optional()
    .custom((amount) => {
      const number = isNaN(amount);
      if (number) {
        throw new Error("Incorrect amount");
      }
      if (parseInt(amount) < 0) {
        throw new Error("Incorrect amount");
      }
      return true;
    })
    .toFloat(),
  body("payroll.securityQuestion")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Security question is not valid"),
  body("payroll.securityAnswer")
    .optional()
    .optional()
    .not()
    .isEmpty()
    .withMessage("Security answer is not valid"),
  body("payroll.amount")
    .optional()
    .custom((amount) => checkNumValue(amount))
    .toFloat(),
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
  getContactWithEmail,
};
