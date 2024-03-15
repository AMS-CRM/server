const express = require("express");
const router = express.Router();
const validator = require("../../validators/notifications");
const controller = require("../../controller/notifications");
const { protect } = require("../../middleware/authMiddleware");
/**
 *
 * @API     POST /notitications
 * @Desc    Register a new notitication
 * @access  Private
 *
 **/
router.post(
  "/",
  validator.registerNotification,
  controller.registerNewPushNotification
);

/**
 *
 * @API     GET /notitications
 * @Desc    Get the list of all notification of a project
 * @access  Private
 *
 **/
router.get("/", protect, controller.getNotificationslist);

module.exports = router;
