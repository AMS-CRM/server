const mongoose = require("mongoose");
const Schema = mongoose.Schema();

const roleSchema = Schema({
    name: {
        type: String,
    }
})

module.exports = rolesSchema = mongoose.model("roles", rolesSchema);