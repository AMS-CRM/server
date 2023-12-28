const ToursModel = require("../../models/Tours.model");
const Bookings = require("../../models/bookings.model");

const { validationResult, matchedData } = require("express-validator");
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
      startDate,
      endDate,
    };
    // Close other batches if the status is changed
    if (status) {
      const closeStatus = await ToursModel.findOneAndUpdate(
        {
          _id: tour,
          "batch.status": true,
        },
        {
          $set: {
            "batch.$.status": false,
          },
        },
        { new: true }
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

// Controller to edit the selected batch
const editSelectedbatch = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(7345).setPayload(errors.array());
    throw new Error(error);
  }

  try {
    const { tourId, batchId, ...updatedData } = matchedData(req);

    // Change the keys
    Object.keys(updatedData).forEach((key) => {
      updatedData[`batch.$.${key}`] = updatedData[key];
      delete updatedData[key];
    });

    // Update the current batch data
    const updatedBatchData = await ToursModel.findOneAndUpdate(
      {
        _id: tourId,
        "batch._id": batchId,
      },
      {
        ...updatedData,
      },
      {
        new: true,
      }
    );

    if (!updatedBatchData) {
      res.status(400).setCode(343);
      throw new Error("Error updating the batch");
    }

    return res.status(200).setCode(873).setPayload(updatedBatchData).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to make a batch primary
const changePrimaryBatch = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(3423).setPayload(errors.array());
    throw new Error(error);
  }

  try {
    const { tourId, batchId } = req.body;
    // Make all the elements false
    const disableAllElements = await ToursModel.findOneAndUpdate(
      {
        _id: tourId,
      },
      {
        $set: {
          "batch.$[].status": false,
        },
      }
    );
    // Change the status
    const changeBatchStatus = await ToursModel.findOneAndUpdate(
      {
        _id: tourId,
        "batch._id": batchId,
      },
      {
        $set: {
          "batch.$.status": true,
        },
      },
      { new: true }
    );

    if (!changeBatchStatus) {
      res.status(400).setCode(1244);
      throw new Error("Something went wrong when changing the batch status");
    }

    return res.status(200).setCode(243).setPayload(changeBatchStatus).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to delete a batch
const deleteBatch = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(746).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { tourId, batchId } = req.body;

    // Check if there are any bookings in batch
    const checkBatchBookings = await Bookings.findOne({
      batch: batchId,
    });

    if (checkBatchBookings) {
      throw new Error("Cannot delete batch with bookings");
    }

    // Delete the batch
    const deleteBatch = await ToursModel.updateOne(
      {
        _id: tourId,
      },
      { $pull: { batch: { _id: batchId } } },
      {
        new: true,
      }
    );

    if (!deleteBatch) {
      res.status(400).setCode(530);
      throw new Error("Something went wrong when deleting the batch");
    }

    return res.status(200).setCode(2334).setPayload(deleteBatch).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Get batch member details
const getBatchMembers = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(200).setCode(3493).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { batchId } = req.body;

    // List members
    const listMembers = await Bookings.findOne(
      {
        batch: batchId,
      },
      {
        _id: 0,
        members: 1,
      },
      {
        new: true,
      }
    ).populate("members");

    if (!listMembers) {
      res.status(400).setCode(934);
      throw new Error("Error finding the members");
    }

    return res.status(200).setCode(6434).setPayload(listMembers).respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBatch,
  findBatch,
  listBatch,
  editSelectedbatch,
  changePrimaryBatch,
  deleteBatch,
  getBatchMembers,
};
