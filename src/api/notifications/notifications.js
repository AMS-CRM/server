const express = require("express");
const router = express.Router();
const validator = require("../../validators/notifications");
const controller = require("../../controller/notifications");
const { protect } = require("../../middleware/authMiddleware");
/**
 *
 * @API     GET /notitications
 * @Desc    Register a new notitication
 * @access  Private
 *
 **/
router.post(
  "/",
  validator.registerNotification,
  controller.registerNewPushNotification
);
module.exports = router;
