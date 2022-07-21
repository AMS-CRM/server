const ServicesModel = require("../models/services.model.js");
const { check, body } = require("express-validator");

const createService = [
    check("name", "Please provide the service name").not().isEmpty(),
    check("route", "Please provide the service route").not().isEmpty(),
    check("data", "Please provide the service Collection").not().isEmpty(),
    check("type", "Please provide the service type").not().isEmpty(),
    body("name").custom(name => ServiceExitByName(name, true))
]

const editService = [
    check("name", "Please provide the service name").not().isEmpty(),
    check("route", "Please provide the service route").not().isEmpty(),
    check("data", "Please provide the service Collection").not().isEmpty(),
    check("type", "Please provide the service type").not().isEmpty(),
    body("name").custom(name => ServiceExitByName(name, false))
]

const deleteService = [
    check("name", "Name is required to delete the document").not().isEmpty(),
    body("name").custom(name => ServiceExitByName(name, false))
]

const ServiceExitByName = async (name, status) => {

    try {
        const service = await ServicesModel.find({ name: name });

        // If we don't want service to exits in the database
        if ( status && service.length != 0 ) {
            throw new Error('Service already exits in the database.');
        } 
        
        // If we want service to exit in database
        if ( !status && service.length == 0 ) {
            throw new Error('Service does not exits in the database');
        }

    } catch (err) {
        console.log(err);
        throw new Error(err)
    }

}

const ServicesExitsById = async (services) => {

    try {

        const getServices = await ServicesModel.countDocuments({"_id": { $in: [ services ] }});
        
        // Compare the array 
        if ( ServicesModel.length !== getServices ) {
            throw new Error('Services does not exits in database');
        }

    } catch (err) {
 
         console.error(err);
         throw new Error(err)
 
    }
 
 }
 module.exports = {
    ServicesExitsById,
    ServiceExitByName,
    createService,
    editService,
    deleteService
}