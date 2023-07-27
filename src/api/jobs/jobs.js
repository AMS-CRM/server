const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const {
  jobsList,
  singleJob,
  jobsApply,
  applyOnJob,
  createJob,
  countJobs,
} = require("../../controller/jobs/index");
const {
  getSingleJob,
  jobsApplyChecks,
  createJobValidation,
} = require("../../validators/jobs");

/***
 *
 * @API     POST /jobs
 * @Desc    Employee apply for a new job
 * @Access  Private
 *
 */
router.post("/", protect, createJobValidation, createJob);

/***
 *
 * @API     get /jobs
 * @Desc    Get the list of all jobs
 * @Access  Private
 *
 */
router.get("/list/:page", protect, jobsList);

/***
 *
 * @API     get /jobs
 * @Desc    Get the list of all jobs
 * @Access  Private
 *
 */
router.get("/count", protect, countJobs);

/***
 *
 * @API     GET /jobs
 * @Desc    Get the list of all jobs
 * @Access  Private
 *
 */
router.get("/:id", protect, getSingleJob, singleJob);

/***
 *
 * @API     POST /jobs
 * @Desc    Employee apply for a new job
 * @Access  Private
 *
 */
router.post("/apply", protect, jobsApplyChecks, applyOnJob);

module.exports = router;
