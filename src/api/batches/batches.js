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
 * @API     PUT /batch
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

/**
 *
 * @API     POST /batch
 * @Desc    Change the primary batch
 * @Access  Private
 *
 */
router.post(
  "/status",
  protect,
  validator.changePrimaryBatch,
  controller.changePrimaryBatch
);

/**
 *
 * @API     POST /batch
 * @Desc    Change the primary batch
 * @Access  Private
 *
 */
router.delete("/", protect, validator.deleteBatch, controller.deleteBatch);

/**
 *
 * @API     POST /batch/memebers
 * @Desc    Get the list of batch members
 * @Access  Private
 *
 */
router.post(
  "/members",
  protect,
  validator.getBatchMembers,
  controller.getBatchMembers
);

module.exports = router;
