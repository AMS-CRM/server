const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { UserRolesContext } = require("twilio/lib/rest/flexApi/v1/userRoles");
const Transaction = require("../../models/transaction.model");
const User = require("../../models/user.model");
const credit = require("../../utils/accountBalance.js");

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
    const receiver = await User.findOne({ email: to }, { _id: 1, balance });

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

    return res.setCode(433).setPayload({ balance }).respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  create,
};
