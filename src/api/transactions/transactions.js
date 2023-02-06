const express = require("express");
const router = express.Router();
const controller = require("../../controller/transactions/transactions");
const validator = require("../../validators/transactions");
const { protect } = require("../../middleware/authMiddleware");

/**
 *
 * @API      /trasactions/list
 * @Desc    Get the list of all transactions for a user
 * @access  PRIVATE
 */
router.get("/list", protect, controller.listTransactions);

/**
 *
 * @API     /transactions/create
 * @Desc    Initate a new transaction
 * @access  PRIVATE
 *
 */
router.post("/create", protect, validator.create, controller.create);

module.exports = router;
