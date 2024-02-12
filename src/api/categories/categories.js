const express = require("express");
const router = express.Router();
const controller = require("../../controller/categories/categories");
const validator = require("../../validators/categories");
const { protect } = require("../../middleware/authMiddleware");
/**
 *
 * @API     POST /categories
 * @Desc    Create new category
 * @Access  Private
 *
 */
router.post(
  "/",
  protect,
  validator.createNewCategory,
  controller.createNewCategory
);

/**
 *
 * @API     POST /categories
 * @Desc    Create new category
 * @Access  Private
 *
 */
router.get("/", protect, controller.listCategories);

module.exports = router;
