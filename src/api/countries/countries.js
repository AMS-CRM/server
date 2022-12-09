const express = require("express");
const router = express.Router();

const {getCountries} = require("../../controller/countries")
const { protect } = require("../../middleware/authMiddleware.js")

/**
 * 
 * @Router  GET /countries
 * @Desc    Get the list of the countries
 * @acess   Private
 * 
 */
router.get("/", protect, getCountries);

module.exports = router;