const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const controller = require("../../controller/products/products");
const validation = require("../../validators/products");

/**
 *
 * @API     POST /products
 * @Desc    Create new product
 * @access  Private
 *
 */
router.post(
  "/",
  protect,
  validation.createNewProduct,
  controller.createNewProduct
);

/**
 *
 * @API     POST /products
 * @Desc    Create new product
 * @access  Private
 *
 */
router.post("/list", protect, validation.listProducts, controller.listProducts);

module.exports = router;
