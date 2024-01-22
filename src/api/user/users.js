const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const controller = require("../../controller/auth/user");
const validator = require("../../validators/user");

//router.get("/package", protect, controller.getPackage);

/**
 *
 * @API     /user/balance
 * @Desc    Get the user total balance
 * @Access  PRIVATE
 *
 */
router.get("/balance", protect, controller.getUserBalance);

/**
 * @API     /user/list
 * @Desc    Get the list of all users
 * @Access  admins PRIVATE
 *
 */
router.get("/list", protect, controller.listUsers);
/**
 * @API     /user/updatePushNotificationStatus
 * @Desc    Update the push notification permission
 * @Access  user PRIVATE
 *
 */
router.patch(
  "/updatePushNotificationStatus",
  protect,
  validator.updatePushNotificationStatus,
  controller.updatePushNotificationStatus
);
/**
 * @API     /user/updatePushNotificationToken
 * @Desc    Update the push notification token
 * @Access  user PRIVATE
 *
 */
router.patch(
  "/updatePushNotificationToken",
  protect,
  validator.updatePushNotificationToken,
  controller.updatePushNotificationToken
);

/**
 *
 * @API       Delete /
 * @Desc      API to delete the user account
 * @Access    Private
 *
 */
router.delete("/", protect, controller.deleteUserAccount);

router.post(
  "/updateBankInformation",
  protect,
  validator.updateBankDetails,
  controller.editUserBankDetails
);

module.exports = router;
