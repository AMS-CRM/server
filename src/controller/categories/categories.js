const asyncHandler = require("express-async-handler");
const { validationResult, matchedData } = require("express-validator");
const CategoryModel = require("../../models/categories.model");

// Controller to create a new category
const createNewCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(343).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const categoryData = matchedData(req);

    if (categoryData.subCategory) {
      const subCategories = CategoryModel.find({
        _id: {
          $in: [categoryData.subCategory],
        },
      });

      if (categoryData.subCategory.length != subCategories.length) {
        res.status(400).setCode(3243);
        throw new Error("Sub categories not found ");
      }
    }
    // Create new category
    const category = await CategoryModel.create(categoryData);

    if (!category) {
      res.status(400).setCode(432);
      throw new Error("Cannot create the categories ");
    }

    return res.status(200).setCode(243).setPayload(category).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to list all the categories
const listCategories = asyncHandler(async (req, res) => {
  try {
    // Get the list of categories
    const list = await CategoryModel.find({ status: true });

    if (!list) {
      throw new Error("No categories are found");
    }

    return res.status(200).setCode(234).setPayload(list).respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createNewCategory,
  listCategories,
};
