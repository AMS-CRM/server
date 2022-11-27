const mongoose = require("mongoose");
const { SupportingDocumentPage } = require("twilio/lib/rest/trusthub/v1/supportingDocument");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'packages',
        required: false  
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roles',
        required: false   
    },
    organization: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'organzations',
        required: false
    },
    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "subscriptions",
        required: false
    }],
    group: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "groups"
    }
})

module.exports = user = mongoose.model("user", userSchema);