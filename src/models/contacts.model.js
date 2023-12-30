const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  labels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "labels",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  dob: {
    type: Date,
    required: false,
  },
  passport: {
    type: String,
    required: false,
  },
  nationality: {
    type: String,
    required: false,
  },
  phone: {
    number: {
      type: Number,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
  },
  address: {
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    postalCode: {
      type: String,
    },
  },
  createdOn: {
    type: Date,
    default: new Date(),
    required: true,
  },
});

module.exports = contacts = mongoose.model("contacts", contactSchema);
