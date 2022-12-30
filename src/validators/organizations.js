const { body } = require("express-validator");

const createOrganzation = [
    body("name").not().isEmpty().withMessage("Name is required").trim().escape(),
    body("email").not().isEmpty().withMessage("Email is required").trim().escape(),
    body("address").not().isEmpty().withMessage("Address is required").trim().escape(),
    body("province").not().isEmpty().withMessage("Province is required").trim().escape(),
    body("city").not().isEmpty().withMessage("City is required").trim().escape(),
    body("postalCode").not().isEmpty().withMessage("Postal code is required").trim().escape()
]

module.exports = {
    createOrganzation
}