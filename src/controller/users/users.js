const utils = require("../../utils/packages.js")
const asyncHandler = require("express-async-handler");

const getPackage = asyncHandler(async (req, res) => {
		
	const user = req.user;

	try {
		const userPackage = await utils.userPackage(user._id);
		return res.status(200).json(userPackage)

	} catch (error) {

		throw new Error(error)

	}
})


module.exports = {
	getPackage
}