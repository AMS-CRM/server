const asyncHandler = async (fn) => {
	try {
		 await fn();
		 return function
	} catch (error) {
		return next(error)
	}
}


module.exports = {
	asyncHandler
}

