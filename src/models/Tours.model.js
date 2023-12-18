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
  startDate: {
    type: Date,
    required: false,
  },
  endDate: {
    type: Date,
    required: true,
  },
  featureImage: {
    type: String,
    required: false,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Tours = mongoose.model("Tours", ToursSchema);
