const express = require("express");
const router = express.Router();
const controller = require("../../controller/transactions/transactions");
const validator = require("../../validators/transactions");
const { protect } = require("../../middleware/authMiddleware");

/**
 *
 * @API     /transactions/create
 * @Desc    Initate a new transaction
 * @access  PRIVATTE
 *
 */
router.post("/create", protect, validator.create, controller.create);

module.exports = router;
