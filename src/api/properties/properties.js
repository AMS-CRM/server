const express = require("express");
const router = express.Router();

// Get the auth middleware
const { protect } = require("../../middleware/authMiddleware");

// Get the controllers
const controller = require("../../controller/properties/properties");
const validator = require("../../validators/properties");

/**
 *
 * @API     Post /properties/
 * @Desc    Create a new property
 * @Access  Private
 *
 */
router.post("/", protect, validator.createProperty, controller.createProperty);

/**
 *
 * @API     GET /properties/tenet
 * @Desc    Add a new tenet to property
 * @Access  Private
 *
 */
router.post(
  "/tenet",
  protect,
  validator.addTenetToProperty,
  controller.addTenetToProperty
);

module.exports = router;
