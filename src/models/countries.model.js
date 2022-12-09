const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CountriesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    flag: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    dial_code: {
        type: String,
        required: true
    }
})

module.exports = Countries = mongoose.model("countries" , CountriesSchema)