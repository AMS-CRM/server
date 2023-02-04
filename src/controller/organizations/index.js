const mongoose = require("mongoose")
const organizations = require("../../models/organizations.model");
const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Create an new organization
const createOrganzation = asyncHandler(async (req, res) => {

    try {

        const errors = validationResult(req);
        if ( !errors.isEmpty() ) {
            res.payload = errors.array();
            res.status(400).setCode(43432)
            throw new Error("Validation errors")
        }

        const { email, name, address, province, postalCode, city } = req.body;
        const user =  req.user._id;
        
        // Check if the organzations exists
        const checkOrg = await organizations.findOne({
            user: user,
            $or: [
                { 
                    email: email
                },
                { 
                    name: name
                }
            ]
        })

        if ( checkOrg ) {
            res.status(400).setCode(3434)
            throw new Error("Organization already exists")
        } 
        const data = {
            email,
            name,
            user,
            address: {
                address,
                province,
                city,
                postalCode
            }
        }
        const createOrg = await organizations.create(data)
        return res.status(200).setCode(843).setPayload(createOrg).respond()


    } catch ( error ) {
        throw new Error(error)
    }


})

// Delete an organization
const deleteOrganinzation = asyncHandler(async  (req, res) => {
    
    try { 

        const {id} = req.params;
        const user = req.user._id;

        const deleteOrganization = await organizations.remove({
            user: user,
            _id: id
        });

        if ( !deleteOrganinzation ) {
            res.status(400).setCode(73)
            throw new Error("Unable to delete organzation")
        } 

        return res.status(200).setCode(84).respond()
        
    } catch ( error ) {
        throw new Error(error)
    }
})


module.exports = {
    createOrganzation,
    deleteOrganinzation
}