const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const controller = require("../../controller/payrolls/payroll.js");
const validation = require("../../validators/payroll");

/**
 *
 * @API     /payroll/
 * @Dec     Create a new payroll
 * @Access  Private
 *
 */
router.post("/", protect, validation.create, controller.create);

module.exports = router;
