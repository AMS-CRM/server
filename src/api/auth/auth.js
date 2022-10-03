const express = require("express");
const router = express.Router();

// Get the middlewares
const { protect } = require("../../middleware/authMiddleware.js")

// Get the controllers 
const { login, sendOneTimePassword, register, phoneRegister, phoneLogin } = require("../../controller/auth/auth.js")
const { getUser, editUser } = require("../../controller/auth/user.js")

// Get the validators
const validators = require("../../validators/user.js")

router.post("/login", validators.credentials, login);
router.post("/register", validators.credentials, register) 
router.get("/user", protect, getUser)
router.put("/user", protect, validators.editUser, editUser)

router.post("/otp", sendOneTimePassword)
router.post("/login/phone", phoneLogin);
router.post("/phoneRegister", validators.register, phoneRegister) 

module.exports = router;