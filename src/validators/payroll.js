const { body, param } = require("express-validator");

const paySubDownloadLink = [
  body("userId").not().isEmpty().withMessage("User id cannot be empty"),
  body("payrollId").not().isEmpty().withMessage("Payroll Id cannot be empty"),
];

const getPayrollData = [
  param("payroll").not().isEmpty().withMessage("Payroll is required"),
];
const approve = [
  body("payroll").not().isEmpty().withMessage("Payroll is required"),
];

const create = [
  body("selectAll")
    .not()
    .isEmpty()
    .withMessage("Select option is required")
    .isBoolean({ strict: true })
    .withMessage("Should be a boolean")
    .custom((select, { req }) => {
      if (!select && req.body.user.length <= 0) {
        throw new Error("No user has beens selected");
      }
      return true;
    }),
];

module.exports = {
  create,
  approve,
  getPayrollData,
  paySubDownloadLink,
};
