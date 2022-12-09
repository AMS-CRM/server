const mongoose = require("mongoose");
const schema =  mongoose.Schema;

const tagSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String, 
        required: false
    },
    desc: {
        type: Strimg, 
        required: false
    }
}) 

modules.exports = Tags = mognoose.model("Tags", tagSchema);