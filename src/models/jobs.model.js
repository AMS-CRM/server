const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: false,
  },
  timing: {
    type: String,
    required: false,
  },
  tags: [
    {
      name: {
        type: String,
      },
      color: {
        type: String,
      },
      text: {
        type: String,
      },
    },
  ],
  categories: [
    {
      type: String,
    },
  ],
  applied: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  location: {
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  estimatedEarnings: {
    type: String,
    required: true,
  },
  wage: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    reqquired: false,
  },
  createdOn: {
    type: Date,
    default: new Date(),
    required: true,
  },
});

module.exports = jobs = mongoose.model("jobs", jobSchema);
