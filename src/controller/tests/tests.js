const testUtils = require("../../utils/tests");
const asyncHandler = require('express-async-handler')


const testList = asyncHandler(async (req, res) => {

	try {

		const getList = await testUtils.getTestList();
		res.status(200).setCode(45).setPayload(getList).respond()

	} catch(error) {
		res.status(500).setCode(45)
		throw new Error(error)
	}

})

module.exports =  {
	testList
}