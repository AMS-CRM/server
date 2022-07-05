const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware.js")
const controller = require("../../controller/tests/tests.js");

router.get("/", protect, controller.testList);

module.exports = router;