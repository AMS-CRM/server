const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { UserRolesContext } = require("twilio/lib/rest/flexApi/v1/userRoles");
const Transaction = require("../../models/transaction.model");
const User = require("../../models/user.model");
const credit = require("../../utils/accountBalance.js");
const {
  pushNotification,
  emailNotifications,
} = require("../../utils/notifications");

// E-transfer
const etransfer = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).setPayload(errors.array()).setCode(748);
      throw new Error("Validation erro");
    }

    // Get the user data
    const { _id: user, name } = req.user;

    // Get the req data
    const { to, transactionId, payroll, securityQuestion, securityAnswer } =
      req.body;
    const amount = parseInt(req.body.amount);

    // For now we only allow transfer to user account
    // Note: This feature was basically designed for the app where user can transfer the virutal currrency
    /* if (to != senderEmail) {
      res
        .status(400)
        .setCode(395)
        .setPayload([{ param: "to", msg: "Use your own email" }]);
      throw new Error("Invalid user email");
    } */

    // Check if the user have enough balance
    const balance = (
      await User.findOne(
        {
          _id: user,
        },
        { balance: 1 }
      )
    ).balance;

    // Check if the user have enough balance
    if (amount > balance) {
      res
        .status(400)
        .setCode(395)
        .setPayload([
          { param: "amount", msg: "You don't have enough balance" },
        ]);
      throw new Error("Invalid transfer amount");
    }

    // Update the user balance
    const newBalance = balance - amount;
    const balanceUpdate = await User.findOneAndUpdate(
      {
        _id: user,
      },
      { balance: newBalance }
    );

    if (!balanceUpdate) {
      res.status(400).setCode(394);
      throw new Error("Something went wrong");
    }

    // Initate the transfer
    const transferData = {
      to: to, // Should be the contact ID
      from: user, // Should be employeer ID
      type: "E-transfer",
      amount,
      transactionId,
      payroll,
      status: "Pending",
      security: {
        question: securityQuestion,
        answer: securityAnswer,
      },
    };

    // Create a new transfer
    const transfer = await Transaction.create(transferData);

    if (!transfer) {
      throw new Error("Cannot initate the transfer");
    }

    // Send the nofication email
    // We are skipping this part for now
    // emailNotifications(name, to, name, amount, process.env.TRANSFER_TEMPLATE);

    return res.status(200).setPayload(transfer).setCode(847).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single transaction
const getTransaction = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).setPayload(errors).setCode(783);
      throw new Error("Validation Error");
    }

    const { transferId } = req.params;
    const { userId } = req.user;

    const transaction = await Transaction.findOne({
      _id: mongoose.Types.ObjectId(transferId),
      $or: [
        {
          $to: userId,
        },
        { $from: userId },
      ],
    }).populate([
      {
        path: "to",
        select: ["name", "email"],
      },
      {
        path: "from",
        select: ["name", "email"],
      },
    ]);

    if (!transaction) {
      throw new Error("Cannot find the transaction");
    }

    return res.status(200).setCode(475).setPayload(transaction).respond();
  } catch (error) {
    throw new Error(error);
  }
});

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
        lifeTimeEarnings: 1,
        name: 1,
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
    const lifeTimeEarnings = receiver.lifeTimeEarnings + amount;

    const receiverBalance = await User.findOneAndUpdate(
      { _id: receiver._id },
      { balance: receiverCredit, lifeTimeEarnings }
    );

    // Send a notification to user
    receiver.allowedPushNotifications &&
      pushNotification(
        receiver.pushNotificationToken,
        "Depoisted Recieved",
        `You have received a transfer from ${req.user.name}`,
        { url: `${process.env.APP_SCHEME_URL}transfer/${transaction._id}` }
      );
    return res.setCode(433).setPayload({ balance }).respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  create,
  etransfer,
  listTransactions,
  getTransaction,
};
