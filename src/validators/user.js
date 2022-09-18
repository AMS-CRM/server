const { body } = require("express-validator");

const editUser = [
	 body('email').isEmail().withMessage("Pleaes provide a valid email addresss"),
	 body("name").not().isEmpty().withMessage("Name is required").trim().escape()
]

/** 
 * Extend the edit user and add subscription with default plan
**/
const register = [
	 body("name").not().isEmpty().withMessage("Name is required").trim().escape(),
	body("test").not().isEmpty().withMessage("Please choose the test you are taking"),
]

module.exports = {
	editUser,
	register
}