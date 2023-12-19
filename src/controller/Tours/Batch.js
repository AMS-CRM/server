const ToursModel = require("../../models/Tours.model");

const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Controller to create a new batch
const createBatch = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(3443).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { tour, name, startDate, endDate, status } = req.body;

    // Check if the tour exits
    const checkTour = await ToursModel.findOne({ _id: tour });

    if (!checkTour) {
      res.status(400).setCode(234);
      throw new Error("Cannot find the tour");
    }

    // Create a new batch
    const tourData = {
      name,
      status,
    };

    // Close other batches if the status is changed
    if (status) {
      const closeStatus = await ToursModel.updateOne(
        {
          _id: tour,

          "batch.status": true,
        },
        { $set: { "batch.$.status": false } }
      );
    }

    const createBatch = await ToursModel.findOneAndUpdate(
      { _id: tour },
      { $push: { batch: tourData } },
      { new: true }
    );

    if (!createBatch) {
      res.status(400).setCode(563);
      throw new Error("Something went wrong while creating a new batch ");
    }

    return res.status(200).setCode(239).setPayload(createBatch).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to set the new batch open
const findBatch = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(3443).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    // Find one batch
    const findBatch = await ToursModel.findOne(
      { _id: req.params.tour, "batch._id": req.params.batch },
      { "batch.$": 1 }
    );

    if (!findBatch) {
      res.status(400).setCode(738);
      throw new Error("No batch found");
    }

    return res.status(200).setCode(200).setPayload(findBatch).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to list all the batch
const listBatch = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(3443).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const listBatches = await ToursModel.findOne(
      { _id: req.params.tour },
      { batch: 1, _id: 0 }
    );

    if (!listBatches) {
      res.status(400).setCode(3434);
      throw new Error("No batch found");
    }

    return res.status(200).setPayload(listBatches).setCode(294).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Route to change the status of a batch
const changeBatchStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(594).setPayload(erros.array());
    throw new Error("Validation error");
  }

  try {
    //    const changeStatus =
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBatch,
  findBatch,
  listBatch,
};
