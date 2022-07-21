const {  validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler")
const Groups = require("../../models/groups.model.js");


const createGroup = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        res.status(400).setCode(742).setPayload(errors.array())
        throw new Error("Validation error")
    }

    try {

        const groups = new Groups({
            name: req.body.name,
            roles: req.body.roles
        })

        const addGroup = await groups.save(groups);
       return res.status(200).setCode(685).setPayload(addGroup).respond()

    } catch (err) {
    
        res.status(500).setCode(988)
        throw new Error(err)
    }


})

module.exports = {
    createGroup
};