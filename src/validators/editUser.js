const { body } = require("express-validator");

const editUser = [
	 body('email').isEmail().withMessage("Pleaes provide a valid email addresss"),
	 body("name").not().isEmpty().withMessage("Name is required").trim().escape()
]

module.exports = {
	editUser
}