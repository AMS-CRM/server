const { body, param } = require("express-validator");

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
  body("featureImage")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Image cannot be empty"),
];

const getTour = [param("_id").not().isEmpty().withMessage("Invalid tour ID")];

module.exports = {
  createTour,
  getTour,
};
