const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { UserRolesContext } = require("twilio/lib/rest/flexApi/v1/userRoles");
const Transaction = require("../../models/transaction.model");
const User = require("../../models/user.model");
const credit = require("../../utils/accountBalance.js");
const pushNotification = require("../../utils/pushNotification");

// List the user transactions
const listTransactions = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    // Get the list of transfers
    const transactions = await Transaction.find({
      $or: [{ to: userId }, { from: userId }],
    })
      .populate({
        path: "to",
        select: ["email", "name"],
      })
      .populate({
        path: "from",
        select: ["name", "email"],
      });

    if (!transactions) {
      res.status(400).setCode(354);
      throw new Error("User does not have any trasactions");
    }

    return res.status(200).setCode(684).setPayload(transactions).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Create a new transaction within the platform
const create = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.setCode(335).status(400).setPayload(errors);
      throw new Error("Validation error");
    }

    const { to } = req.body;
    const amount = parseInt(req.body.amount);
    const { _id: user } = req.user._id;

    // Get the user current balance
    const { balance } = await credit(user);

    // Check if the user have enought credits
    if (amount > balance) {
      throw new Error("You don't have enough credits for transfer");
    }

    if (amount < 0) {
      throw new Error("Transfer cannot be initated");
    }

    // Check if the fund receiver exists
    const receiver = await User.findOne(
      { email: to },
      {
        _id: 1,
        balance: 1,
        pushNotificationToken: 1,
        allowedPushNotifications: 1,
      }
    );

    if (!receiver) {
      throw new Error("Cannot initate transfer for the email provided");
    }

    if (receiver._id.valueOf() == user.valueOf()) {
      throw new Error("You cannot send money to yourself");
    }

    const senderDebit = balance - amount;
    const senderBalance = senderDebit <= 0 ? 0 : senderDebit;

    // Log a transaction
    const transaction = await Transaction.create({
      to: receiver._id,
      from: user,
      amount: amount,
      type: "Pay",
      status: "Success",
    });

    if (!transaction) {
      throw new Error("Cannot initate a transfer. Something went wrong");
    }

    const debit = await User.findOneAndUpdate(
      { _id: user },
      { balance: senderBalance }
    );

    const receiverCredit = receiver.balance + amount;

    const receiverBalance = await User.findOneAndUpdate(
      { _id: receiver._id },
      { balance: receiverCredit }
    );

    // Send a notification to user
    receiver.allowedPushNotifications &&
      pushNotification(receiver.pushNotificationToken);
    return res.setCode(433).setPayload({ balance }).respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  create,
  listTransactions,
};
