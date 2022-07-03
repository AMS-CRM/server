const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packageSchema = new Schema({
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
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tests',
        required: true
    }
})

module.exports = packages = mongoose.model("packages", packageSchema);