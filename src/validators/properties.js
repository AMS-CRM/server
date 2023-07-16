const { body } = require("express-validator");

const createProperty = [
  body("name").not().isEmpty().withMessage("Name cannot be empty"),
  body("address1").not().isEmpty().withMessage("Address cannot be empty"),
  body("city").not().isEmpty().withMessage("City cannot be empty"),
  body("postalCode").not().isEmpty().withMessage("Post code cannot be empty"),
  body("province").not().isEmpty().withMessage("Province cannot be empty"),
  body("rent").not().isEmpty().withMessage("Rent cannot be empty"),
  body("landlord")
    .not()
    .isEmpty()
    .withMessage("Landlord number cannot be empty"),
];

const addTenetToProperty = [
  body("propertyName")
    .not()
    .isEmpty()
    .withMessage("Tenet name is not provided"),
  body("tenetName")
    .not()
    .isEmpty()
    .withMessage("Property name is not provided"),
  body("tenetPhoneNumber")
    .not()
    .isEmpty()
    .withMessage("Phone number is not provided"),
];

module.exports = {
  createProperty,
  addTenetToProperty,
};
