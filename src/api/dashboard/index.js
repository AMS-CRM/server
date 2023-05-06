const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware.js");
const controller = require("../../controller/dashboard/dashboard.js");
/**
 *
 * @API     GET /dashboard
 * @Desc    Get the dashboard data
 * @Access  PRIVATE
 *
 */
router.get("/", protect, controller.getDashboardData);

module.exports = router;
