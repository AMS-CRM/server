// Get the models
const Subscription = require("../models/subscriptions.model") 
const packages = require("../models/packages.model") 
const test =  require("../models/tests.model") 
const modules = require("../models/modules.model") 

// Get the student package
const userPackage = async (userId) => {

	try {


		// Get the student package 
		const package = await Subscription.findOne({user: userId})
		.populate({
			path: "package",
			populate: {
				path: "test",
				populate: "modules"

			}
		})


		if ( !package ) {
			throw new Error("Student does not have any plans");
		}

		return package;

	} catch (error) {

		throw new Error(error)
	}

}

module.exports = {
	userPackage
}