const express = require("express");
const router = express.Router();
const validation = require("../../validators/orders");
const controller = require("../../controller/orders/orders");
const { protect } = require("../../middleware/authMiddleware");
/*
 *
 * @API       POST /orders
 * @Desc      Place a new order
 * @Access    Private
 *
 */
router.post("/", protect, validation.createNewOrder, controller.createNewOrder);

/*
 *
 * @API       Patch /orders
 * @Desc      Remove item from order
 * @Access    Private
 *
 */
router.patch(
  "/",
  protect,
  validation.removeOrderItem,
  controller.removeOrderItem
);

module.exports = router;
