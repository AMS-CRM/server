const { validationResult } = require("express-validator");
const { addressToGeoCode } = require("../../utils/geoCode");
const { pushNotificationList } = require("../../utils/courier");

// Get the models
const Jobs = require("../../models/jobs.model");
const asyncHandler = require("express-async-handler");

// Function to count the total number of jobs
const countJobs = asyncHandler(async (req, res) => {
  try {
    const countJobs = await Jobs.count({});

    if (!countJobs) {
      res.status(400).setCode(343);
      throw new Error("Something went wront when counting the jobs");
    }

    // Get the total number of pages
    const pages = Math.ceil(countJobs / process.env.PAGE_LIMIT);

    return res.status(200).setCode(200).setPayload({ pages }).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Function to create a new job post
const createJob = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(343).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const {
      title,
      wage,
      location,
      estimatedEarnings,
      timing,
      desc,
      notifyTitle,
      notifyBody,
      phone,
      email,
    } = req.body;

    // Convert location address to lag and long
    const { latitude, longitude } = (await addressToGeoCode(location))[0];
    // Create a new jobs post
    const createJobsPost = await Jobs.create({
      title,
      wage,
      location: {
        address: location,
        latitude: latitude,
        longitude: longitude,
      },
      desc,
      estimatedEarnings,
      timing,
      phone,
      email,
    });

    if (!createJobsPost) {
      res.status(400).setCode(744).setPayload(createJobsPost);
      throw new Error("Something went wrong");
    }

    // Send the push notification if requested
    if (notifyTitle && notifyBody) {
      const url = `${process.env.APP_SCHEME_URL}job?jobId=${createJobsPost._id}`;
      console.log(url);
      await pushNotificationList(
        process.env.DEFAULT_PUSH_NOTIFICATION_LIST,
        notifyTitle,
        notifyBody,
        { url }
      );
    }

    return res.status(200).setCode(433).setPayload(createJobsPost).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to fetch the list of jobs
const jobsList = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setStatus(400).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const PAGE_LIMIT = process.env.PAGE_LIMIT || 5;
    const PAGE = req.params.page || 0;
    const SKIP_JOBS = PAGE * PAGE_LIMIT;

    // Get the list of all the jobs
    const jobsList = await Jobs.find({}).skip(SKIP_JOBS).limit(PAGE_LIMIT);

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
    const { _id: user } = req.user;

    // Get the list of all the jobs
    let jobsList = await Jobs.findOne({
      _id: id,
    });

    if (!jobsList) {
      throw new Error("No jobs found!");
    }
    // Filter the user from ID
    jobsList = jobsList.toObject();
    const filterAppliedUser = jobsList.applied.filter(
      (x) => x.toString() === user.toString()
    );

    if (filterAppliedUser.length != 0) {
      jobsList.applied = true;
    } else {
      jobsList.applied = false;
    }

    return res.status(200).setCode(445).setPayload(jobsList).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Module to apply for a job
const applyOnJob = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setPayload(errors.array()).setCode(343);
    throw new Error("Validation error");
  }

  try {
    const { jobId } = req.body;
    const { _id: user } = req.user;

    // Check if the user already applied for the job
    const checkJobApplications = await Jobs.findOne({
      _id: jobId,
      applied: user,
    });

    if (checkJobApplications) {
      throw new Error("User already applied for this job");
    }

    // Apply for the job
    const applyForJob = await Jobs.findOneAndUpdate(
      {
        _id: jobId,
      },
      {
        $push: {
          applied: user,
        },
      },
      {
        new: true,
      }
    );

    // Apply for the job
    if (!applyForJob) {
      throw new Error("Something went wrong when applying for a job");
    }

    return res.status(200).setCode(232).setPayload(applyForJob).respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  jobsList,
  createJob,
  singleJob,
  applyOnJob,
  countJobs,
};
