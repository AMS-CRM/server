const { body } = require("express-validator");

const registerNotification = [
  body("title").notEmpty().withMessage("Notification title cannot be empty"),
  body("body").notEmpty().withMessage("Notifications body cannot be empty"),
];

module.exports = {
  registerNotification,
};
