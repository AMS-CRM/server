const mongoose = require("mongoose");
const Schema =  mongoose.Schema;

const contactSchema = new Schema({
    name: {
        type: String,
        required: true
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
    createdOn: {
        type: Date, 
        default: new Date(),
        required: true
    }
})

module.exports = contacts = mongoose.model("contacts", contactSchema);