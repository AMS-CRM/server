const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertQueueSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
});

module.exports = propertQueue = mongoose.model(
  "propertyQueue",
  propertQueueSchema
);
