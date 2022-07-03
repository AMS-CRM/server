const mongoose = require("mongoose");
const Schema = mongoose.Schema();

const roleSchema = Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        reqiured: true
    }
})

module.exports = rolesSchema = mongoose.model("roles", rolesSchema);