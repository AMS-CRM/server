const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tours",
    required: true,
  },
  bookingRef: {
    type: String,
    required: false,
  },
  numberOfMembers: {
    type: Number,
    required: false,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "contacts",
    },
  ],
  bookedOn: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["In Progress", "Cancelled", "Booked", "Confirmed", "Refunded"],
    default: "In Progress",
  },
  recordPayments: [
    {
      paymentMethod: {
        type: String,
        enum: ["Stripe", "Cash", "Credit Card", "Debit Card"],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ["Completed", "Processing"],
      },
      createdOn: {
        type: Date,
        default: Date.now(),
        required: true,
      },
      reference: {
        type: String,
        required: false,
      },
    },
  ],
  payments: {
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Paid", "Pending", "Partially Paid"],
      default: "Pending",
    },
    remaningBalance: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
      required: true,
    },
  },
});

module.exports = Bookings = mongoose.model("Bookings", bookingSchema);
