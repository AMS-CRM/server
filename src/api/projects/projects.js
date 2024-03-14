const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const validator = require("../../validators/projects");
const controller = require("../../controller/projects/projects");

/**
 *
 * @API     /projects
 * @Desc    Create a new project
 * @Access  Private
 *
 */
router.post("/", protect, validator.createProject, controller.createProject);

module.exports = router;
