const testUtils = require("../../utils/tests");
const asyncHandler = require('express-async-handler')


const testList = asyncHandler(async (req, res) => {

	try {

		const getList = await testUtils.getTestList();
		res.status(200).json(getList)

	} catch(error) {

		res.status(500)
		throw new Error(error)
	}

})

module.exports =  {
	testList
}