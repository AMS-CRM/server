const { param, body } = require("express-validator");

const getSingleJob = [
  param("id").not().isEmpty().withMessage("No jobs found with given ID"),
];

const jobsApplyChecks = [
  body("jobId").not().isEmpty().withMessage("No jobs found with given ID"),
];

const getJobsByPage = [
  param("page").not().isEmpty().withMessage("Page number is required"),
];

const createJobValidation = [
  body("title").not().isEmpty().withMessage("Title is required"),
  body("wage").not().isEmpty().withMessage("Wage is required"),
  body("location").not().isEmpty().withMessage("Location  is required"),
  body("estimatedEarnings")
    .not()
    .isEmpty()
    .withMessage("Estimated earnings is requied"),
  body("timing").not().isEmpty().withMessage("Timings are required"),
  body("desc").not().isEmpty().withMessage("Description are required"),
];

module.exports = {
  getSingleJob,
  createJobValidation,
  jobsApplyChecks,
};
