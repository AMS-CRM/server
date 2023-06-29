const { body, param } = require("express-validator");
const checkNumValue = require("../utils/checkNumValue");
const Contact = require("../models/contacts.model");

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
    .custom((phone) => phone.match(/^\d{10}$/))
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
  body("payroll.overTimeHours")
    .optional()
    .custom((amount) => checkNumValue(amount))
    .toFloat(),
  body("payroll.bonusPay")
    .optional()
    .custom((amount) => checkNumValue(amount))
    .toFloat(),
  body("salary.payCycle").optional().isString().withMessage("Invalid value"),
  body("salary.bankAccount.accountNo")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Invalid bank account number")
    .isLength({ min: 5, max: 5 })
    .withMessage("The lenght of Account number must be 5"),
  body("salary.bankAccount.transitNo")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Invalid transit number")
    .isLength({ min: 5, max: 5 })
    .withMessage("The lenght of Account number must be 5"),
  body("salary.bankAccount.instituteNo")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Invalid transit number")
    .isLength({ min: 3, max: 3 })
    .withMessage("The lenght of Account number must be 3"),
  body("salary.transferMethod")
    .optional()
    .isString()
    .withMessage("Invalid value")
    .custom(async (value, { req }) => {
      // Check if the direct depost details exists
      if (value == "Direct Deposit") {
        //console.log(req.body.user);
        const res = await Contact.findOne({
          _id: req.body.user,
          $and: [
            { "salary.bankAccount.accountNo": { $exists: true, $ne: "" } },
            { "salary.bankAccount.instituteNo": { $exists: true, $ne: "" } },
            { "salary.bankAccount.transitNo": { $exists: true, $ne: "" } },
          ],
        });
        if (!res) {
          throw new Error("Bank details are missing");
        }
      }

      return true;
    }),
  body("payroll.extraPay")
    .optional()
    .custom((amount) => checkNumValue(amount))
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
