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
    required: true,
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
  payments: {
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Paid", "Pending", "Partial Payment"],
    },
    amountPaid: {
      type: Number,
      required: false,
    },
    reference: {
      type: String,
      required: false,
    },
  },
});

module.exports = Bookings = mongoose.model("Bookings", bookingSchema);
