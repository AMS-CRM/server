const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    address: [{
        address: {
            type: String
        },
        province: {
            type: String,
        },
        city: {
            type: String
        },
        postalCode: {
            type: String
        }
    }],
    createdOn: {
        type: Date,
        default: new Date(),
        required: true
    }
})

module.exports = rolesSchema = mongoose.model("organizations", organizationSchema);