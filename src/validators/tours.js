const { body, param } = require("express-validator");
const { createContact } = require("./contacts");

// List tours
const listTours = [
  param("search").optional().notEmpty().withMessage("Invalid search query"),
];

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

// Edit the current tour
const editTour = [
  body("tourId").not().isEmpty().withMessage("Invalid Tour ID"),
  body("name").optional().not().isEmpty().withMessage("Name cannot be empty"),
  body("description")
    .optional()
    .not()
    .isEmpty()
    .withMessage("description cannot be empty"),
  body("startDate")
    .optional()
    .not()
    .isEmpty()
    .withMessage("startDate cannot be empty"),
  body("endDate")
    .optional()
    .not()
    .isEmpty()
    .withMessage("endDate cannot be empty"),
  body("price").optional().not().isEmpty().withMessage("price cannot be empty"),
  body("bookingState")
    .optional()
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

// Get the single bookings
const singleBooking = [
  param("bookingId").not().isEmpty().withMessage("Invalid booking Id"),
];

// Get the single batch
const findBatch = [
  param("batch").not().isEmpty().withMessage("Invalid batch ID"),
  param("tour").not().isEmpty().withMessage("Invalid tour ID"),
];

// List all the batches
const listBatch = [
  param("tour").not().isEmpty().withMessage("Invalid tour ID"),
];

// Get the bookings list for a specific batch
const getBookingsListInBatch = [
  param("batchId").not().isEmpty().withMessage("Invalid tour ID"),
];

// Get the bookings list for a particular contact
const getContactBookingDetails = [
  param("contactId").not().isEmpty().withMessage("Invalid contact ID"),
];

// Get the tour informatiom
const getTour = [
  param("tourId").not().isEmpty().withMessage("Invalid tour ID"),
];

// Delete the batch
const deleteSelectedBatch = [
  body("batchId").not().isEmpty().withMessage("Batch Id is not defined"),
];

// Edit the batch
const editSelectedbatch = [
  body("tourId").not().isEmpty().withMessage("Tour ID is not valid"),
  body("batchId").not().isEmpty().withMessage("Batch ID is not valid"),
  body("name").optional().not().isEmpty().withMessage("Batch name is required"),
  body("startDate")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Start date is required"),
  body("endDate")
    .optional()
    .not()
    .isEmpty()
    .withMessage("End Date is required"),
];

// Set the batch status
const changePrimaryBatch = [
  body("tourId").not().isEmpty().withMessage("Batch id is not defined"),
  body("batchId").not().isEmpty().withMessage("Batch id is not defined"),
];

// Get the members list within batch
// Get the single batch
const getBatchMembers = [
  body("batchId").not().isEmpty().withMessage("Batch id is not defined"),
];

// Delete a batch
const deleteBatch = [...changePrimaryBatch];

// Get the booking based on the tour for current user
const getLoggedInUserBookingByTour = [...changePrimaryBatch];

// Validator to create a booking payments
const createBookingPayments = [
  body("bookingId").not().isEmpty().withMessage("Invalid booking"),
];

// Set the tour status -- Uses the same controller as edit

module.exports = {
  createTour,
  getTour,
  createBatch,
  findBatch,
  listBatch,
  newBooking,
  singleBooking,
  getBookingsListInBatch,
  editTour,
  getContactBookingDetails,
  deleteSelectedBatch,
  editSelectedbatch,
  listTours,
  changePrimaryBatch,
  deleteBatch,
  getBatchMembers,
  getLoggedInUserBookingByTour,
  createBookingPayments,
};
