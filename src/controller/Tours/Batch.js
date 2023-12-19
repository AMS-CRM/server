import ToursModel from "../../models/Tours.model";

const { validationResult } = require("express-validator");
const asyncHandler = require("async-handler");

// Controller to create a new batch
const createBatch = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(3443).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { tour, name, startDate, endData, status } = req.body;

    // Check if the tour exits
    const checkTour = await ToursModel.findOne({ _id: tour });

    // Create a new batch
    const tourData = {
      name,
      startDate,
      endDate,
      status,
    };

    // Close other batches if the status is changed
    if (status) {
      const closeStatus = await ToursModel.update({ "batch.$.status": false });

      if (!closeStatus) {
        res.status(400).setCode(3423);
        throw new Error("Something went wrong when creating a new batch");
      }
    }

    const createBatch = await ToursModel.update(
      { $push: tourData },
      { new: true }
    );

    if (!createBatch) {
      res.status(400).setCode(563);
      throw new Error("Something went wrong while creating a new batch ");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to set the new batch open

//

export default {
  createBatch,
};
