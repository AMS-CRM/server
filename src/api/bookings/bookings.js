const express = require("express");
const router = express.Router();
const validator = require("../../validators/tours.js");
const controller = require("../../controller/Tours/Bookings.js");
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
 * @API         GET /bookings/contact
 * @Desc        Get the booking detail of a contact
 * @Access      Private
 *
 */
router.get(
  "/contact/:contactId",
  protect,
  validator.getContactBookingDetails,
  controller.getContactBookingDetails
);

/**
 *
 * @API     GET /bookings/batch/:batchid
 * @Desc    Get a list of bookings in a particular batch
 * @Access  Private
 *
 */
router.get(
  "/batch/:batchId",
  protect,
  validator.getBookingsListInBatch,
  controller.getBookingsListInBatch
);

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

/**
 *
 * @API     GET /bookings/current/user
 * @Desc    Get the bookings of current user
 * @access  Private
 *
 */
router.get("/current/user", protect, controller.getLoggedInUserBookings);

/**
 *
 * @API     GET /bookings/current/user
 * @Desc    Get the bookings of current user
 * @access  Private
 *
 */
router.post(
  "/current/user/tour",
  protect,
  validator.getLoggedInUserBookingByTour,
  controller.getLoggedInUserBookingByTour
);

module.exports = router;
