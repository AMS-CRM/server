const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { serviceNameToId } = require("../../utils/servicesNameToID.js")

// Get the models
const Roles = require("../../models/roles.model.js")
const Groups = require("../../models/groups.model.js")


//Create roles
const createRole = asyncHandler(async(req, res) => {
        // Check the request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           res.status(400).setCode(785).setPayload(errors.array());
           throw new Error("Validation error")
        }
        const { name, permissions } = req.body;

       const services = serviceNameToId(permissions);
        
        
        try {

            // Create for a new role
            const role = new Roles({
                name: name,
                permissions: services
            });
        
            const addRole = await role.save(role);
            return res.status(200).setCode(845).setPayload(addRole).respond()

            
        } catch (err) {

            // Log the error on console
            res.status(500).setCode(984)
            throw new Error(err)

        }
});

// Edit Role
const editRole = asyncHandler(async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).setCode(456).setPayload(errors.array())
        throw new Error("Validator error")
    }

    const { name, permissions } = req.body;
    const services = serviceNameToId(permissions);
    try {
        
        // Delete the role
        const editRole = await Roles.findOneAndUpdate({ name: name }, { permissions: services });  
        return res.status(200).setPayload(editRole).setCode(826).respond()

    } catch (err) {

        res.status(500).setCode(711);
        throw new Error(error)

    }

})

// Delete Role
const deleteRole = asyncHandler(async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).setCode(738).setPayload(errors.array())
            throw new Error("Validator error");
        }
    
        try {
    
            const { name } = req.body;
    
            // Delete the role
            const deleteRole = await Roles.findOneAndDelete({ name: name });  
            const id = deleteRole._id;
    
            //Delete the reference
            const deleteGroupReference = await Groups.findOneAndUpdate({ $pull: { "roles":  { $in: id}}})
    
            return res.status(200).setCode(674).setPayload(deleteRole).respond()
    
        } catch (err) {
    
            res.status(500).setCode(788);
            throw new Error(err)
    
        }
    
})

module.exports = {
    createRole,
    editRole,
    deleteRole
}
