const { body } = require("express-validator");

const createTour = [
  body("name").not().isEmpty().withMessage("Name cannot be empty"),
  body("description")
    .not()
    .isEmpty()
    .withMessage("description cannot be empty"),
  body("startDate").not().isEmpty().withMessage("startDate cannot be empty"),
  body("endDate").not().isEmpty().withMessage("endDate cannot be empty"),
  body("price").not().isEmpty().withMessage("price cannot be empty"),
  body("bookingState")
    .not()
    .isEmpty()
    .withMessage("bookingState cannot be empty"),
];

module.exports = {
  createTour,
};
