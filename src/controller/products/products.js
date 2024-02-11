const asyncHandler = require("express-async-handler");
const { validationResult, matchedData } = require("express-validator");
const ProductsModel = require("../../models/products.model");
const { create } = require("../../models/categories.model");

// Controller to create a new product
const createNewProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(9344).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const product = matchedData(req);
    const createProduct = await ProductsModel.create(product);

    if (!createProduct) {
      res.status(400).setCode(3243);
      throw new Error("Error when createing a new product");
    }

    return res.setCode(234).setPayload(createProduct).respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createNewProduct,
};
