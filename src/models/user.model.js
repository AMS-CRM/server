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
  type: {
    type: String,
    required: true,
    defaulter: "tenet",
  },
  accountVerified: {
    type: Boolean,
    required: true,
    default: false,
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
  subscriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subscriptions",
      required: false,
    },
  ],
});

module.exports = user = mongoose.model("user", userSchema);
