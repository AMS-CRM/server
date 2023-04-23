const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const controller = require("../../controller/payrolls/payroll.js");
const validation = require("../../validators/payroll");

/**
 *
 * @API     POST /payroll/
 * @Desc     Create a new payroll
 * @Access  Private
 *
 */
router.post("/", protect, validation.create, controller.create);

/**
 *
 * @API     GET /payroll/
 * @Desc    List all the payrolls
 * @Access  Private
 *
 */
router.get("/", protect, controller.list);

module.exports = router;
