const express = require("express");
const router = express.Router();
const controller = require("../../controller/billing/orders.js")
const { protect }= require("../../middleware/authMiddleware")
/**
 * 
 * @Desc Create a new order
 */
router.post("/", protect, controller.createOrder);

module.exports = router;