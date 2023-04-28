const { body } = require("express-validator");

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
};
