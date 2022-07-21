const ServicesModel = require("../models/services.model.js")

// Convert service names to ID and reconstruct the array
const serviceNameToID = async (permissions) =>{
    let services=[]
    for ( var i = 0; i<permissions.length; i++) {
        const serviceID = await ServicesModel.findOne({name: permissions[i]["service"]}).select("_id");
        if (serviceID) {
            services.push({service: serviceID._id,  access: permissions[i]["access"]})
        }
    }
}
module.exports = {
    serviceNameToID
}