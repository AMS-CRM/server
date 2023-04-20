const { body } = require("express-validator");

const create = [
  body("selectAll")
    .not()
    .isEmpty()
    .withMessage("Select option is required")
    .isBoolean({ strict: true })
    .withMessage("Should be a boolean"),
];

module.exports = {
  create,
};
