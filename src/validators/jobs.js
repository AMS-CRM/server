const { param, body } = require("express-validator");

const getSingleJob = [
  param("id").not().isEmpty().withMessage("No jobs found with given ID"),
];

const jobsApplyChecks = [
  body("id").not().isEmpty().withMessage("No jobs found with given ID"),
];

module.exports = {
  getSingleJob,
  jobsApplyChecks,
};
