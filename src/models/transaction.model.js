const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contacts",
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  payroll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "payrolls",
    required: true,
  },
  type: {
    type: String,
    enum: ["E-transfer", "CHQ"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["successful", "pending", "in progress", "failed", "cancelled"],
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
