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
const newBooking = [
  body("tour").not().isEmpty().withMessage("The provided tour is invalid"),
  body("batch").not().isEmpty().withMessage("The provided tour is invalid"),
  body("numberOfMembers")
    .not()
    .isEmpty()
    .withMessage("Please provide number of members"),
  ...createContact,
];

// Create a new batch
const createBatch = [
  body("tour").not().isEmpty().withMessage("Tour is not valid"),
  body("name").not().isEmpty().withMessage("Batch name is required"),
  body("startDate").not().isEmpty().withMessage("Start date is required"),
  body("endDate").not().isEmpty().withMessage("End Date is required"),
  body("status").isBoolean().withMessage("Please provide a valid status"),
];

const singleBooking = [
  param("bookingId").not().isEmpty().withMessage("Invalid booking Id"),
];

const findBatch = [
  param("batch").not().isEmpty().withMessage("Invalid batch ID"),
  param("tour").not().isEmpty().withMessage("Invalid tour ID"),
];

const listBatch = [
  param("tour").not().isEmpty().withMessage("Invalid tour ID"),
];

const getTour = [param("_id").not().isEmpty().withMessage("Invalid tour ID")];

module.exports = {
  createTour,
  getTour,
  createBatch,
  findBatch,
  listBatch,
  newBooking,
  singleBooking,
};
