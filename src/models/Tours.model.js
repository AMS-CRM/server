const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ToursSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  bookingState: {
    type: String,
    enum: ["Full", "Booking", "Closed", "Waitlist", "TBA"],
  },
  featureImage: {
    type: String,
    required: false,
  },
  batch: [
    {
      name: {
        type: String,
        required: true,
      },
      status: {
        type: Boolean,
        required: true,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      bookings: [
        {
          type: String,
          ref: "Bookings",
          required: true,
        },
      ],
    },
  ],
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Tours = mongoose.model("Tours", ToursSchema);
