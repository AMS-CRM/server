const express = require("express");
const router = express.Router();
const validator = require("../../validators/tours.js");
const controller = require("../../controller/Tours/bookings.js");
const { protect } = require("../../middleware/authMiddleware");

/**
 *
 * @API         POST /bookings/post
 * @Desc        Create a new booking or add contact to booking
 * @Access      Private
 *
 */
router.post("/", protect, validator.newBooking, controller.newBooking);

/**
 *
 * @API         GET /bookings/
 * @Desc        Get the list of bookings
 * @Access      Private
 *
 */
router.get("/", protect, controller.getBookingList);

/**
 *
 * @API         GET /bookings/user
 * @Desc        List all the bookings of a particular user
 * @Access      Private
 *
 */
router.get("/user/:user", protect, controller.getUsersBookingsData);

/**
 *
 * @API         GET /bookings/post
 * @Desc        Create a new booking or add contact to booking
 * @Access      Private
 *
 */
router.get(
  "/:bookingId",
  protect,
  validator.singleBooking,
  controller.singleBooking
);

module.exports = router;
