const express = require("express");
const router = express.Router();
const {  validationResult } = require("express-validator");

// Get the validators
const validators = require("../../validators/services");
// Get the middleware
const protect = require("../../middleware/authMiddleware.js")
// Get the controllers
const controller = require("../../controller/services/serviecs.js")




/**
 * 
 * @Route    POST /api/servies
 * @Desc     Route to create a service
 * @access   Private
 * @User     Admin
 * 
 */
router.post("/", protect, validators.createService, controller.createService)

/**
 * 
 * @ROUTE    PUT /api/services
 * @Desc     Route to edit the service
 * @access   Private 
 * @user     Admin
 *
 */
router.put("/",protect, validators.editService, controller.editService)

/**
 * 
 * @ROUTE    DELETE /api/services
 * @Desc     Route to delete the service
 * @access   Private 
 * @user     Admin
 *
 */
router.delete("/", protect, validators.deleteService, controll.deleteService)


module.exports = router;