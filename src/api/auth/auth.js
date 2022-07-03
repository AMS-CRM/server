const express = require("express");
const router = express.Router();

// Get the middlewares
const { protect } = require("../../middleware/authMiddleware.js")

// Get the controllers 
const { login, sendOneTimePassword, register } = require("../../controller/auth/auth.js")
const { getUser, editUser } = require("../../controller/auth/user.js")

// Get the validators
const validators = require("../../validators/user.js")

router.post("/login", login);
router.post("/otp", sendOneTimePassword)
router.get("/user", protect, getUser)
router.put("/user", protect, validators.editUser, editUser)
router.post("/register", protect, validators.register, register) // To complete the registration

module.exports = router;