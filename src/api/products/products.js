const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const controller = require("../../controller/products/products");

/**
 *
 * @API     POST /products
 * @Desc    Create new product
 * @access  Private
 *
 */
router.post("/", protect, controller.createNewProduct);

module.exports = router;
