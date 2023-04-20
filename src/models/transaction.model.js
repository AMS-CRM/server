const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  type: {
    type: String,
    enum: ["etransfer", "Pay"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Success", "Pending", "Failed", "Rejected", "Cancelled"],
  },
  security: {
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
  },
  message: {
    type: String,
    required: false,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
    reqiured: true,
  },
});

module.exports = transactions = mongoose.model(
  "transactions",
  transactionSchema
);
