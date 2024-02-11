const { body } = require("express-validator");

const createNewOrder = [
  body("items").isArray({ min: 1 }).withMessage("No items were added"),
  body("items.*.id").not().isEmpty().withMessage("Invalid item provided"),
  body("items.*.quantity")
    .notEmpty()
    .isNumeric()
    .withMessage("Item quantity is valid"),
  body("items.*.note")
    .optional()
    .notEmpty()
    .withMessage("Item quantity cannot be empty"),
];

const removeOrderItem = [
  body("orderId").notEmpty().withMessage("Order Id is not provided"),
  body("itemId").notEmpty().withMessage("Item id is not provided"),
  body("quantity")
    .notEmpty()
    .isNumeric()
    .withMessage("Invalid qunatity provided"),
];

module.exports = {
  createNewOrder,
  removeOrderItem,
};
