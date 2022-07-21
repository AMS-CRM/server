const Roles = require("../models/roles.model.js");
const mongoose = require("mongoose");
const serviceValidator = require("./services.js")
const { check, body } = require("express-validator");

const createRole = [
    check("name", "Name is required").not().isEmpty(),
    check("permissions", "Permissions are required").not().isEmpty(),
    body('name').custom(name => RoleExitsByName(name, true)),
    body('permissions').custom(permissions => RolesPermissionValidator(permissions))
]

const editRole = [  
    check("name", "Reference to the role is required.").not().isEmpty(),
    body('name').custom(name => RoleExitsByName(name, false)),
    body('permissions').custom(permissions => RolesPermissionValidator(permissions, false))
]

const deleteRole = [
    check("name", "Reference to the role is required.").not().isEmpty(),
    body('name').custom(name => RoleExitsByName(name, false))
]

// Check if the role exits 
const RoleExitsByName = async (name, status) => {
    try { 
               
        // check if the role exits in the database
        const checkRole = await Roles.find({ name: name });

        // If we don't want role to exits in the database
        if ( status && checkRole.length != 0 ) {
            return Promise.reject('Role already exits in the database, Maybe try editing it');
        } 
        
        // If we want role to exit in database
        if ( !status && checkRole.length == 0 ) {
            return Promise.reject('Role does not exits in the database');
        }
 
   } catch (err) {

        console.error(err);
        throw new Error(err);

   }

}

// Get the role services
const RolesPermissionValidator = async (permissions) => {

    try {


        const acceptedAccessTypes = ["full", "read-only", "write-only"];
        const errors = []

        permissions.map(async (permission) => {
            const { service, access } = permission;
            if ( acceptedAccessTypes.indexOf(access) == -1 ) {
               errors.push(`Invalid ${access}`)
            }
        })

        if (errors.length != 0) { 
           return Promise.reject(errors) 
        }

    } catch (err) {

        console.error(err);
        throw new Error(err);
    }
}

// Roles does not exits in the database
const RolesExitsById = async (roles) => {

    try {

        const getRoles = await Roles.countDocuments({"_id": { $in: [ roles ] }});
        
        // Compare the array 
        if ( roles.length !== getRoles ) {
            return Promise.reject('Roles does not exits in database');
        }

    } catch (err) {
 
         console.error(err);
         throw new Error(err);
 
    }
 
 }

module.exports = {
    deleteRole,
    createRole,
    editRole,
    RoleExitsByName,
    RolesPermissionValidator,
    RolesExitsById
}