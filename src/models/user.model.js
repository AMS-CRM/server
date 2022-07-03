const mongoose = require("mongoose");
const { SupportingDocumentPage } = require("twilio/lib/rest/trusthub/v1/supportingDocument");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
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
    }]
})

module.exports = user = mongoose.model("user", userSchema);