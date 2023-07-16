const { body } = require("express-validator");

const editUser = [
  body("email").optional().isEmail().withMessage("Email provided is incorrect"),
  body("name")
    .optional()
    .trim()
    .escape()
    .custom((value) => {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        throw new Error("Name can only contain letters");
      }
      const arr = value.split(" ");

      if (arr.length != 2) {
        throw new Error("Provide both the first and last name");
      }

      return true;
    }),
];

const updatePushNotificationStatus = [
  body("pushNotificationStatus")
    .not()
    .isEmpty()
    .withMessage("Status not found")
    .custom((item) => {
      if (typeof item != "boolean") {
        throw new Error("Invalid status");
      }
      return true;
    }),
];

const updatePushNotificationToken = [
  body("pushNotificationToken")
    .not()
    .isEmpty()
    .withMessage("Token is not provided"),
];

// Update the user bank information
const updateBankDetails = [
  body("accountNumber")
    .not()
    .isEmpty()
    .isLength({ min: 5, max: 5 })
    .withMessage("Provide 5 digits account number"),
  body("instituteNumber")
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 3 })
    .withMessage("Provide 5 digits transit number"),
  body("transitNumber")
    .not()
    .isEmpty()
    .isLength({ min: 5, max: 5 })
    .withMessage("Provide 3 digits transit number"),
];

/**
 * Extend the edit user and add subscription with default plan
 **/
const register = [
  body("name").not().isEmpty().withMessage("Name is required").trim().escape(),
  body("test")
    .not()
    .isEmpty()
    .withMessage("Please choose the test you are taking"),
];

const credentials = [
  body("email").isEmail().withMessage("Pleaes provide a valid email addresss"),
  body("password")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Please choose the test you are taking"),
];

module.exports = {
  editUser,
  register,
  credentials,
  updatePushNotificationStatus,
  updatePushNotificationToken,
  updateBankDetails,
};
