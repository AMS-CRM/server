const asyncHandler = require("express-async-handler");
const { validationResult, matchedData } = require("express-validator");

// Get the models
const Tour = require("../../models/Tours.model");

// Controller to edit tour
const editTour = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(934).setPayload(errors.array());
    throw new Error("Validation error");
  }

  const { tourId, ...updateData } = matchedData(req);

  try {
    // Update the current tour
    const updateCurrentTour = await Tour.findOneAndUpdate(
      {
        _id: tourId,
      },
      {
        ...updateData,
      },
      {
        new: true,
      }
    );

    if (!updateCurrentTour) {
      res.status(200).setCode(5334);
      throw new Error("Something went wrong updating the tour");
    }

    return res.status(200).setCode(234).setPayload(updateCurrentTour).respond();
  } catch (error) {
    throw new Error(error);
  }
});

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
    const {
      name,
      description,
      startDate,
      endDate,
      price,
      bookingState,
      featureImage,
    } = req.body;
    const tourData = {
      name,
      description,
      startDate,
      endDate,
      price,
      bookingState,
      featureImage,
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
const listTours = asyncHandler(async (req, res) => {
  try {
    // Get the list of the tours
    const Tours = await Tour.find({});

    if (!Tours) {
      res.status(400).setCode(3294);
      throw new Error("Cannot list the tours");
    }

    return res.status(200).setCode(249).setPayload(Tours).respond();
  } catch (error) {
    throw new Error(error);
  }
});

/**
 *
 * @Desc    Controller to get one tour data
 *
 */
const getTour = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(433).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { _id } = req.body;

    // Get the list of the tours
    const tour = await Tour.findOne({ _id });

    if (!tour) {
      res.status(400).setCode(3294);
      throw new Error("Cannot list the tours");
    }

    return res.status(200).setCode(249).setPayload(tour).respond();
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
  listTours,
  getTour,
  editTour,
};
