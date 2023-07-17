const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const {
  jobsList,
  singleJob,
  jobsApply,
  applyOnJob,
} = require("../../controller/jobs/index");
const { getSingleJob, jobsApplyChecks } = require("../../validators/jobs");

/***
 *
 * @API     GET /jobs
 * @Desc    Get the list of all jobs
 * @Access  Private
 *
 */
router.get("/", protect, jobsList);

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
