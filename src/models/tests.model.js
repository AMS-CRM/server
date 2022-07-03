const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const testSchema = new Schema({

	name: {
		type: String,
		required: true
	},
	scale: {
		min: {
			type: String,
			required: true
		},
		max: {
			type: Number,
			required: true
		}
	},
	modules: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "modules"
	}]
});

module.exports = tests = mongoose.model("tests", testSchema);