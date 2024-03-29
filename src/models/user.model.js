const mongoose = require("mongoose");
const {
  SupportingDocumentPage,
} = require("twilio/lib/rest/trusthub/v1/supportingDocument");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ["admin", "user", "employee"],
    default: "user",
    required: true,
  },
  pushNotificationToken: {
    type: String,
    required: false,
  },
  allowedPushNotifications: {
    type: Boolean,
    required: false,
  },
  balance: {
    type: Number,
    default: 0,
    required: true,
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "packages",
    required: false,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "roles",
    required: false,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "organzations",
    required: false,
  },
  subscriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subscriptions",
      required: false,
    },
  ],
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "groups",
  },
});

module.exports = user = mongoose.model("user", userSchema);
