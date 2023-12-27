const express = require("express");
const router = express.Router();

// Get the controller
const controller = require("../../controller/Tours/Batch.js");
const validator = require("../../validators/tours.js");

// Get the auth middleware
const { protect } = require("../../middleware/authMiddleware.js");

/**
 *
 * @API     Post /batch
 * @Desc    Create a new tour batch
 * @Access  Private
 *
 */
router.get("/", protect, validator.createBatch, controller.createBatch);

/**
 *
 * @API     Get /batch/list
 * @Desc    Get the list of the batches
 * @Access  Private
 *
 */
router.get("/list/:tour", protect, validator.listBatch, controller.listBatch);

/**
 *
 * @API     Get /batch/:batch
 * @Desc    Get the details of one batch
 * @Access  Private
 *
 */
router.get("/:tour/:batch", protect, validator.findBatch, controller.findBatch);

/**
 *
 * @API     PUT /batch/:batch
 * @Desc    Edit the current batch
 * @Access  Private
 *
 */
router.put(
  "/",
  protect,
  validator.editSelectedbatch,
  controller.editSelectedbatch
);

module.exports = router;
