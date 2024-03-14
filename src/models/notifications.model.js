const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    ref: "projects",
    required: true,
  },
  createdOn: {
    type: String,
    required: true,
    default: Date.now(),
  },
});

module.exports = notitications = mongoose.model(
  "notifications",
  notificationSchema
);
