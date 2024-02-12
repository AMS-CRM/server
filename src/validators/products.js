const { body, param } = require("express-validator");

const createNewProduct = [
  body("name").notEmpty().withMessage("Product cannot be empty"),
  body("description").notEmpty().withMessage("Description is required"),
  body("featureImage").notEmpty().withMessage("Featured image is required"),
  body("price").notEmpty().isNumeric().withMessage("Give price is incorrect"),

  //body("category").notEmpty().withMessage("Category cannot be empty"),
];

// List products
const listProducts = [
  body("searchQuery")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Page is not defined"),
  body("page").not().isEmpty().withMessage("Page is not defined"),
];

module.exports = {
  createNewProduct,
  listProducts,
};
