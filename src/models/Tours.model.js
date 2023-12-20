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
        required: false,
      },
      startDate: {
        type: Date,
        required: false,
      },
      endDate: {
        type: Date,
        required: true,
      },
      createOn: {
        type: Date,
        default: Date.now(),
      },
      bookings: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
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
            enum: [
              "In Progress",
              "Cancelled",
              "Booked",
              "Confirmed",
              "Refunded",
            ],
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
