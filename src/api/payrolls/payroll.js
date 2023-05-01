const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const controller = require("../../controller/payrolls/payroll.js");
const validation = require("../../validators/payroll");

/**
 *
 * @API     PUT /payroll
 * @Desc     Create a new payroll
 * @Access  Private
 *
 */
router.post("/", protect, validation.create, controller.create);

/**
 *
 * @API     GET /payroll/:payroll
 * @Desc    GEt a specific payroll
 * @Access  Private
 *
 */
router.get(
  "/:payroll",
  protect,
  validation.getPayrollData,
  controller.getPayrollData
);

/**
 *
 * @API     POST /payroll//approve
 * @Desc    Approve a payroll
 * @Access  Private
 *
 */
router.put("/approve", protect, validation.approve, controller.approve);

/**
 *
 * @API     GET /payroll/
 * @Desc    List all the payrolls
 * @Access  Private
 *
 */
router.get("/", protect, controller.list);

module.exports = router;
