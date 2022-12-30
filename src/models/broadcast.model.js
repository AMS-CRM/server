const mongoose = require("mongoose");
const Schema =  mongoose.Schema;

const BroadcastSchema = new Schema({
    
});

module.exports = broadcast = mongoose.model("broadcast", BroadcastSchema)
