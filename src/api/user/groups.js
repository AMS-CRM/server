const express = require("express");
const router = express.Router();
const controllers = require("../../controller/users/group.js")
const validators = require("../../validators/groups.js")
const { protect } = require("../../middleware/authMiddleware");
/**
 * 
 * @Route   POST /api/groups
 * @Desc    Route to create a group
 * @Access  Private
 * @User    Admin
 * 
 */
router.post("/", protect, validators.createGroup, controllers.createGroup);


module.exports = router;