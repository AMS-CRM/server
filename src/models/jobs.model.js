const mongoose = require("mongoose");
const { stringify } = require("uuid");
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
      type: String,
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
    type: Number,
    required: true,
  },
  wage: {
    type: Number,
    required: true,
  },
});

module.exports = jobs = mongoose.model("jobs", jobSchema);
