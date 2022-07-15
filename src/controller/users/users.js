const utils = require("../../utils/packages.js")
const asyncHandler = require("express-async-handler");

const getPackage = asyncHandler(async (req, res) => {
		
	const user = req.user;

	try {
		const userPackage = await utils.userPackage(user.id);
		return res.status(200).setCode(456).setPayload(userPackage).respond()

	} catch (error) {
		res.status(400).setCode(354)
		throw new Error(error)

	}
})


module.exports = {
	getPackage
}