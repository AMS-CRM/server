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

/**
 *
 * @API     GET /tours/list/{search}
 * @Desc    Get the tours list
 * @access  Private
 *
 */
router.get(
  "/list/:search?",
  protect,
  validator.listTours,
  controller.listTours
);

/**
 *
 * @API     GET /tours/:id
 * @Desc    Get a single tour data
 * @access  Private
 *
 */
router.get("/:tourId", protect, validator.getTour, controller.getTour);

/**
 *
 * @API         PUT /tours
 * @Desc        Edit the exisitng tour
 * @Access      Private
 *
 */
router.put("/", protect, validator.editTour, controller.editTour);

module.exports = router;
