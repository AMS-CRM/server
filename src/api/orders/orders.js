const express = require("express");
const router = express.Router();
const validation = require("../../validators/orders");
const controller = require("../../controller/orders/orders");
/*
 *
 * @API       POST /orders
 * @Desc      Place a new order
 * @Access    Private
 *
 */
router.post("/", validation.createNewOrder, controller.createNewOrder);

module.exports = router;
