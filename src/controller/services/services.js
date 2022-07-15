const asyncHandler = require("express-async-handler" )

// Get the models
const Services = require("../../models/services.model.js");
const Roles = require("../../models/Roles.js");

//  Create service
const createService = asyncHandler(async(res, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).setCode(343).setPayload(errors.array())
        throw new Error("Validation error")
    }

    try { 
        
        // Create new service
        const service = new Services({
            name: req.body.name,
            route: req.body.route,
            data: req.body.data,
            type: req.body.type
        });

        const newService = await service.save(service);
        const id = newService._id;

        // Add a new permission to admin 
        await Roles.findOneAndUpdate({name: "Admin"}, { $push: { "permissions": { "service": id, "accessType": "full"}} });
          return res.status(200).setCode(655).setPayload(newService).respond()

    
    } catch (err) {

         res.status(500).setCode(7438)
         throw new Error(err)

    }

})

const editService = asyncHandler(async(req, res) => {
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        res.status(404).setCode(777).setPayload(errors.array())
        throw new Error("Validation failed")
    }

    try {

        // Create new service
        const data = {
            route: req.body.route,
            data: req.body.data,
            type: req.body.type
        };

        const editService = await Services.findOneAndUpdate({name: req.body.name}, data);
        return res.status(200).setCode(477).setPayload(editService).respond()

    } catch(err) {

        res.status(500).code(758)
        throw new Error(err)
    }

})

const deleteService = asyncHandler(async(req, res) => {
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        res.status(404).setPayload(errors.array()).setCode(954);
        throw new Error("Validation error")
    }

    try {

        // Delete the service
        const deleteService = await Services.findOneAndDelete({name: req.body.name});
        const id = deleteService._id;
        
        // Delete the role reference 
        const deleteRoleReference = await Roles.findOneAndUpdate({ $pull: { "permissions": {  "service": id }}})

        res.status(200).setPayload(deleteService).setCode(443).respond()

    } catch(err) {

        res.status(500).setCode(545)
        throw new Error(err)
    }
})

module.exports = {
    createService,
    editService,
    deleteService
}