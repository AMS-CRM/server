const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	color: {
		type: String,
		required: true
	}
});

module.export = modules = mongoose.model("modules", moduleSchema);