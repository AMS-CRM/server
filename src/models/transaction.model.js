const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contact",
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
