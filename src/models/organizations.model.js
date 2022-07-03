const mongoose = require("mongoose");
const Schema = mongoose.Schema();

const organizationSchema = Schema({
    name: {
        type: String,
    }
})

module.exports = rolesSchema = mongoose.model("organizations", organizationSchema);