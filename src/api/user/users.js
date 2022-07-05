const express = require("express");
const router = express.Router();
const {protect} = require("../../middleware/authMiddleware")
const controller = require("../../controller/users/users.js");

router.get("/package", protect, controller.getPackage)

module.exports = router;