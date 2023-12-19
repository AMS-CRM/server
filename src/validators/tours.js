const { body, param } = require("express-validator");
const { createContact } = require("./contacts");

// Create a tour
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

// Book a tour
const bookTour = [
  body("numberOfMembers")
    .not()
    .isEmpty()
    .withMessgae("Please number of the number of members"),
  body("tour").not().isEmpty().withMessage("Tour is not valid"),
  ...createContact,
];

// Create a new batch
const createBatch = [
  body("tour").not().isEmpty().withMessage("Tour is not valid"),
  body("name").not().isEmpty().withMessage("Batch name is required"),
  body("startDate").not().isEmpty().withMessage("Start date is required"),
  body("endDate").not().isEmpty().withMessage("End Date is required"),
  body("status").not().isBoolean().withMessage("Please provide a valid status"),
];

const getTour = [param("_id").not().isEmpty().withMessage("Invalid tour ID")];

module.exports = {
  createTour,
  getTour,
};
