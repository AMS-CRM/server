const express = require("express");
const router = express.Router();

// Get the controller
const controller = require("../../controller/Tours/Batch.js");
const validator = require("../../validators/tours.js");

/**
 *
 * @API     Post /batch
 * @Desc    Create a new tour batch
 * @Access  Private
 *
 */
router.get("/", { protect }, validator.createBatch, controller.createBatch);

export default router;
