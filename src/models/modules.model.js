const mongoose = require("mongoose");
const Schema = mongoose.Schema();

const moduleSchema = new Schame({
	name: {
		type: String,
		required: true
	},
	color: {
		type: String,
		required: true
	}
});

modules.export = modules = mongoose.model("modules", moduleSchema);