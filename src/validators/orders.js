const { body } = require("express-validator");

const createNewOrder = [
  body("items").isArray({ min: 1 }).withMessage("No items were added"),
  body("items.*.id").not().isEmpty().withMessage("Invalid item provided"),
  body("items.*.quantity")
    .notEmpty()
    .isFloat({ min: 1 })
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

const addProductToOrder = [
  body("orderId").notEmpty().withMessage("Order Id is not provided"),
  body("itemId").notEmpty().withMessage("Item id is not provided"),
  body("quantity")
    .notEmpty()
    .isFloat({ min: 1 })
    .withMessage("Invalid qunatity provided"),
  body("notes").optional().notEmpty().withMessage("Notes cannot be empty"),
];

module.exports = {
  createNewOrder,
  removeOrderItem,
  addProductToOrder,
};
