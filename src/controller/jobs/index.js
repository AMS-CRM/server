const { validationResult } = require("express-validator");

// Get the models
const Jobs = require("../../models/jobs.model");
const asyncHandler = require("express-async-handler");

// Controller to fetch the list of jobs
const jobsList = asyncHandler(async (req, res) => {
  try {
    // Get the list of all the jobs
    const jobsList = await Jobs.find({});

    if (!jobsList) {
      throw new Error("No jobs found!");
    }

    return res.status(200).setCode(445).setPayload(jobsList).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Apply for a new job
const jobsApply = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.setCode(343).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { id } = req.body;
    const user = req.user._id;
    console.log(user, id);

    // Apply for the job
    const jobsCheck = await Jobs.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $push: { applied: user },
      }
    );

    if (!jobsCheck) {
      res.setCode(349);
      throw new Error("Cannot apply for the job");
    }

    return res.setCode(4354).setPayload(jobsCheck).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single job details
const singleJob = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.setCode(343).setPayload(errors.array());
    throw new Error("Validation error");
  }
  try {
    const { id } = req.params;
    // Get the list of all the jobs
    const jobsList = await Jobs.findOne({
      _id: id,
    });

    if (!jobsList) {
      throw new Error("No jobs found!");
    }

    return res.status(200).setCode(445).setPayload(jobsList).respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  jobsList,
  singleJob,
  jobsApply,
};
