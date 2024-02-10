const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  itemList: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      qunatity: {
        type: String,
        required: true,
      },
      amount: {
        type: String,
        reqiured: true,
      },
      notes: {
        type: String,
        required: false,
      },
    },
  ],
  recordPayments: {
    method: {
      type: String,
      enum: ["UPI", "COD", ""],
      required: true,
    },
    referenceObject: {
      type: Map,
    },
    amount: {
      type: String,
    },
  },
  payments: {
    totalAmount: {
      type: Number,
    },
    amountPaid: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid"],
      required: true,
      default: "Pending",
    },
  },
  orderStatus: {
    type: String,
    enum: [
      "Received",
      "Confirmed",
      "Making",
      "Dispatched",
      "Delivered",
      "Completed",
    ],
    default: "Received",
  },
  orderCreatedOn: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  orderUpdatedOn: {
    type: Date,
    required: false,
  },
});

module.exports = orders = mongoose.model("orders", orderSchema);
