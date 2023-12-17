const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

// Get the models
const Tour = require("../../models/Tours.model");

/**
 * @Desc    Create a new tour
 */
const createTour = asyncHandler(async (req, res) => {
  // Handle the validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(323).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { name, description, startDate, endDate, price, bookingState } =
      req.body;
    const tourData = {
      name,
      description,
      startDate,
      endDate,
      price,
      bookingState,
    };

    const createTour = await Tour.create(tourData);

    if (!createTour) {
      res.status(400).setCode(334);
      throw new Error("Something went wrong when createing a new tour");
    }

    return res.status(200).setCode(434).setPayload(createTour).respond();
  } catch (error) {
    throw new Error(error);
  }
});

/**
 * @Desc    Controller to get the list of the tours
 */
const getTours = asyncHandler(async (req, res) => {
  try {
    // Get the list of the tours
  } catch (error) {
    throw new Error(error);
  }
});

/**
 * @Desc    Controller to create a new tour
 */

/**
 * @Desc    Controller to edit the existing tour
 */

/**
 * @Desc    Controller to delete a tour
 */

module.exports = {
  createTour,
};
