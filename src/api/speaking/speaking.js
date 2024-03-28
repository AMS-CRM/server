const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const controller = require("../../controller/speaking/index");

/**
 * @API     GET /speaking
 * @Desc     Get the list of all speaking modules
 * @access  Public
 *
 */
router.get("/", controller.speakingList.speakingQuestionListPublic);

module.exports = router;
