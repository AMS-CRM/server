const asyncHandler = require("express-async-handler");
const { validationResults } = require("express-validator");
const ProductsModel = require("../../models/products.model");

// Controller to create a new product
const createNewProduct = asyncHandler(() => {
  try {
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createNewProduct,
};
