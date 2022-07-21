const {ServiceExitByName} = require("../validators/services.js");

/**
 * 
 * @Desc Whenever new service is created 
 * @Desc  Grant admin the full access to the service
 * 
 */
const {serviceNameToID} = require("./servicesNameToID.js");
const Roles = require("../models/roles.model.js");
const Group = require("../models/groups.model.js");

// Add role to group
const addRoleToGroup = async (group, role) => {

    const doc = {
        name: group,
    }

    try {

       // Check if group exists
       const adminGroup = await Group.findOneAndUpdate(
        {name: group}, 
        {$set: doc, $push: {roles: role}},
        {upsert: true });
        return adminGroup;

    } catch(err) {
        console.log(err)
        throw new Error(err)
    }

}

// Create a new admin role
const newAdminRole = async (serviceId, name) => {
    try {

        const role = new Roles({
            name: `${name}-admin`,
            permissions: [{
                service: serviceId,
                access: "full"
            }]
    })

        const createRole = await role.save();
        return createRole;

        
    } catch(err) {
        throw new Error(err)
    }
}

module.exports = {
    addRoleToGroup,
    newAdminRole
}