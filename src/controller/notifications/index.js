const asyncHandler = require("express-async-handler");
const { validationResult, matchedData } = require("express-validator");
const notificationModel = require("../../models/notifications.model");
const projectModel = require("../../models/project.model");

// Controller to register a new push notification
const registerNewPushNotification = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setPayload(errors.array()).setCode(9312);
    throw new Error("Validation error");
  }

  try {
    // Check if the project exists
    const checkProjectExists = await projectModel.findOne({
      key: req.headers["x-api-key"],
    });

    if (!checkProjectExists) {
      throw new Error("Invalid API key");
    }

    const notificationData = {
      user: checkProjectExists.user,
      project: req.headers["x-api-key"],
      ...matchedData(req),
    };

    const createNotification = await notificationModel.create(notificationData);

    if (!createNotification) {
      throw new Error("Unable to create new notification");
    }

    return res
      .status(200)
      .setCode(234)
      .setPayload(createNotification)
      .respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Get the list of the notitications
const getNotificationslist = asyncHandler(async (req, res) => {
  try {
    // Get the list of notifications
    const response = await notificationModel.find({
      user: req.user._id,
    });

    if (!response) {
      throw new Error("There is no notifications to list");
    }

    return res.status(200).setCode(232).setPayload(response).respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  registerNewPushNotification,
  getNotificationslist,
};
