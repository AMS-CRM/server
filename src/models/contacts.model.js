const mongoose = require("mongoose");
const Schema =  mongoose.Schema;

const contactSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    labels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "labels"
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    dateOfbirth: {
        type: Date, 
        required: true,
    },
    passport: {
        type: String,
        required: true, 
    },
    nationality: {
        type: String,
        required: true
    },
    phone: {
       number: {
            type: Number,
            required: true
       },
       country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "countries",
            required: true
       }
    },
    address: {
        address: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        postalCode: {
            type: String
        }
    },
    createdOn: {
        type: Date, 
        default: new Date(),
        required: true
    }
})

module.exports = contacts = mongoose.model("contacts", contactSchema);