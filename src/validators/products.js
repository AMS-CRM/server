const { body } = require("express-validator");

const createNewProduct = [
  body("name").notEmpty().withMessage("Product cannot be empty"),
  body("description").notEmpty().withMessage("Description is required"),
  body("featureImage").notEmpty().withMessage("Featured image is required"),
  body("price").notEmpty().isNumeric().withMessage("Give price is incorrect"),

  //body("category").notEmpty().withMessage("Category cannot be empty"),
];

module.exports = {
  createNewProduct,
};
