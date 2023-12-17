const express = require("express");
const router = express.Router();
const validator = require("../../validators/tours.js");
const controller = require("../../controller/Tours/Tours");
const { protect } = require("../../middleware/authMiddleware");

/**
 *
 * @API     POST /tours/
 * @Desc    Create a new tour
 * @Access  Private
 *
 */
router.post("/", protect, validator.createTour, controller.createTour);

module.exports = router;
