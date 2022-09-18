const { body } = require("express-validator");

/** 
 * Extend the edit user and add subscription with default plan
**/
const createContact = [
	 body("name").not().isEmpty().withMessage("Name is required").trim().escape(),
     body("email").not().isEmpty().withMessage("Email is required to create a new contact")
]

const deleteContact = [
	body("email").not().isEmpty().withMessage("Please provide the contact you want to delete").trim().escape()
]

module.exports = {
	createContact,
	deleteContact
}