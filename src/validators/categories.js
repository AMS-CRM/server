const { body } = require("express-validator");

const createNewCategory = [
  body("name").notEmpty().withMessage("Category name is required"),
  body("description")
    .notEmpty()
    .withMessage("Category desceiption is required"),
  body("iconImage").notEmpty().withMessage("Category desceiption is required"),
  body("featureImage")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Category desceiption is required"),
  body("subCategory")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Category desceiption is required"),
];

module.exports = { createNewCategory };
