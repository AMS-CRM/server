const express = require("express");
const router = express.Router();

// Get the middlewares
const { protect } = require("../../middleware/authMiddleware.js");

// Get the controllers
const {
  createContact,
  getContacts,
  deleteContact,
  editContact,
} = require("../../controller/contacts/contacts.js");

// Get the validators
const validators = require("../../validators/contacts.js");

/**
 *
 * @Route    POST /api/contacts
 * @Desc     Route to create new contact
 * @access   Private
 * @User     Any
 *
 */
router.post("/", protect, validators.createContact, createContact);

/**
 *
 * @Route    GET /api/contacts
 * @Desc     Route to create new contact
 * @access   Private
 * @User     Any
 *
 */
router.get("/:page?/:search?/:keyword?", protect, getContacts);

/**
 *
 * @Route    GET /api/contacts
 * @Desc     Route to create new contact
 * @access   Private
 * @User     Any
 *
 */
router.delete("/", protect, validators.deleteContact, deleteContact);

/**
 *
 * @Route    PUT /api/contacts
 * @Desc     Route to edit a contact
 * @access   Private
 * @User     Any
 *
 */
router.put("/", protect, validators.editContact, editContact);

module.exports = router;
