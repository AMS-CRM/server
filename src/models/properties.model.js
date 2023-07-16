const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertiesSchema = Schema({
  name: {
    type: String,
    required: false,
  },
  address: {
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    postalCode: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      requireD: true,
    },
  },
  landlord: {
    type: String,
    required: true,
  },
  rent: {
    type: Number,
    required: true,
  },
  tenets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "users",
    },
  ],
  montlyRent: [
    {
      month: {
        type: Date,
      },
      utilities: [
        {
          type: String,
        },
      ],
      transactions: [
        {
          tenet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
          },
          amount: { type: String },
          transactionRef: {
            type: String,
          },
        },
      ],
      totalRentReceived: {
        type: Number,
      },
      totalRent: [
        {
          type: Number,
        },
      ],
    },
  ],
  createdOn: {
    type: Date,
    default: new Date(),
    requird: true,
  },
});

module.exports = properties = mongoose.model("properties", propertiesSchema);
