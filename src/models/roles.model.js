const mongoose = require("mongoose");

RolesSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    permissions: [{
        service: { 
            type : mongoose.Schema.Types.ObjectId, 
            required: true,
            ref: 'Services' 
        },
        access: {
            type: String, 
            required: true
        }
    }],
});

module.exports = Roles = mongoose.model('Roles', RolesSchema);