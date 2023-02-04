const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

// Get the models
const User = require("../../models/user.model");

// Get the user details
const getUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    res.status(500).setCode(45);
    throw new Error("User profile not found");
  }

  return res.status(200).setPayload(user).setCode(43).respond();
});

// Get the list of the users
const listUsers = asyncHandler(async (req, res) => {
  try {
    const list = await User.find({});
    if (!list) {
      res.status(400).setCode(3434);
      throw new Error("No user found in the database");
    }
    return res.status(200).setCode(234).setPayload(list).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Update the user push notification status
const updatePushNotificationStatus = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).setCode(343).setPayload(errors);
      throw new Error("Validation Error");
    }

    const userId = req.user._id;
    const { pushNotificationStatus } = req.body;

    const updateNoficiationsStatus = await User.findOneAndUpdate(
      { _id: userId },
      { allowedPushNotifications: pushNotificationStatus },
      { new: true, projection: { allowedPushNotifications: 1 } }
    );

    if (!updateNoficiationsStatus) {
      res.status(400).setCode(234);
      throw new Error("Cannot update the nofication status");
    }
    return res.setCode(695).setPayload(updateNoficiationsStatus).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Update the push notification token
const updatePushNotificationToken = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).setCode(345).setPayload(errors);
      throw new Error(errors);
    }
    const userId = req.user._id;
    const { pushNotificationToken } = req.body;
    console.log(pushNotificationToken);
    const updateNotificationToken = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      { pushNotificationToken: pushNotificationToken },
      { new: true, projection: { pushNotificationToken: 1 } }
    );

    if (!updateNotificationToken) {
      throw new Error("Cannot update the push token");
    }

    return res.setCode(695).setPayload(updateNotificationToken).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Edit the current user data
const editUser = asyncHandler(async (req, res) => {
  const user = req.user;

  // Check the error from the validator
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).setCode(346).setPayload(errors.array());
    throw new Error("Validation error");
  }

  const update = {
    email: req.body.email,
    name: req.body.name,
  };

  try {
    const editUser = await User.findOneAndUpdate(user._id, update, {
      new: true,
    });
    return res
      .status(200)
      .setPayload({ ...editUser._doc, token: req.token })
      .setCode(24)
      .respond();
  } catch (error) {
    res.status(400).setCode(345);
    throw new Error(error);
  }
});

module.exports = {
  getUser,
  editUser,
  listUsers,
  updatePushNotificationStatus,
  updatePushNotificationToken,
};
