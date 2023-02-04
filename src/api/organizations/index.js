const express = require("express");
const router = express.Router();


const { createOrganzation, deleteOrganinzation } = require("../../controller/organizations/index.js")
const {protect} = require("../../middleware/authMiddleware")
const validators = require("../../validators/organizations.js")


/**
 * @API     POST /organizations
 * @Desc    Create a new organzation 
 * @Access  Private
 *  
 **/
router.post("/", protect, validators.createOrganzation, createOrganzation);

/**
 * @API     DELETE /organizations
 * @Desc    Delete organzation 
 * @Access  Private
 *  
 **/
router.delete("/:id", protect, deleteOrganinzation);

module.exports = router;