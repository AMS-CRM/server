const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

/**
 *
 * @API     POST /webhooks/vopay
 * @Desc    Get the event updates from vopay
 * @access  Key protected
 *
 */
router.post(
  "/vopay",
  asyncHandler(async (req, res) => {
    console.log(req.body);
    return res.status(200).setCode(43).respond();
  })
);

module.exports = router;
