const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

const { createCourierProfile } = require("../../utils/courier");
const {
  zumConnect,
  createZumUser,
  updateBankAccountInformation,
} = require("../../utils/zum");

// Get the models
const User = require("../../models/user.model");

// Get user balance balance
const getUserBalance = asyncHandler(async (req, res) => {
  try {
    const user = req.user._id;
    const balance = await User.findOne(
      {
        _id: user,
      },
      {
        _id: 0,
        balance: 1,
        lifeTimeEarnings: 1,
      }
    );

    if (!balance) {
      throw new Error("Cannot get the user balance");
    }

    return res.status(200).setCode(485).setPayload(balance).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Create the zumrails users with bank details
// The function will not save the user bank details in the database
const editUserBankDetails = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).setCode(340).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    // Get the user information
    const { _id } = req.user;
    const { accountNumber, transitNumber, instituteNumber } = req.body;

    // Connect to the zumrails server
    const response = await zumConnect();
    // Get the token
    const { Token } = response.data.result;

    // Get the user information
    const getUserData = await User.findOne({
      _id,
    });

    if (!getUserData) {
      res.status(400).setCode(3534);
      throw new Error("Something went wrong when fetching the user");
    }

    // Check if the user already have an account on zum
    if (getUserData.paymentsId) {
      const updateBankAccount = await updateBankAccountInformation(
        Token,
        getUserData.paymentsId,
        instituteNumber,
        transitNumber,
        accountNumber
      );
      if (updateBankAccount.data.isError) {
        res.status(400).setStatus(933);
        throw new Error("Cannot update the bank information");
      }

      return res.status(200).setPayload(getUserData).setCode(833).respond();
    }

    const { name, email, phoneNumber } = getUserData;
    const [firstName, lastName] = name.split(" ");

    if (response.data.isError) {
      res.status(400).setStatus(933);
      throw new Error("Cannot create the user");
    }

    const zumUser = await createZumUser(
      Token,
      firstName,
      lastName,
      email,
      phoneNumber,
      _id,
      instituteNumber,
      transitNumber,
      accountNumber
    );

    if (zumUser.data.isError) {
      res.status(400).setStatus(733);
      throw new Error("Cannot create the user");
    }
    // Get the user ID
    const addZumUserId = await User.findOneAndUpdate(
      {
        _id,
      },
      { paymentsId: zumUser.data.result.Id },
      { new: true }
    );

    if (!addZumUserId) {
      res.status(400).setStatus(773);
      throw new Error("Cannot add the user ID to database");
    }
    return res.status(200).setCode(3434).setPayload(addZumUserId).respond();
  } catch (error) {
    throw new Error(error);
  }
});

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

    const updateNotificationToken = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      { pushNotificationToken: pushNotificationToken },
      { new: true }
    );

    if (!updateNotificationToken) {
      throw new Error("Cannot update the push token");
    }
    // Update the courier profile
    const updateCourierProfile = await createCourierProfile(
      userId,
      updateNotificationToken.name,
      updateNotificationToken.email,
      updateNotificationToken.phoneNumber,
      pushNotificationToken
    );

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

    if (!editUser) {
      throw new Error("Something went wrong when editing the user");
    }

    // Update the courier profile
    const updateCourierProfile = await createCourierProfile(
      user._id,
      editUser.name,
      editUser.email,
      editUser.phoneNumber
    );

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
  getUserBalance,
  updatePushNotificationStatus,
  updatePushNotificationToken,
  editUserBankDetails,
};
