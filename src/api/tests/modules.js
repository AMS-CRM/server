const express = require("express");
const router = express.Router();
const protect = require("../../middleware/authMiddleware")
//router.get("/", protect, controller.modulesList)

module.exports = router;