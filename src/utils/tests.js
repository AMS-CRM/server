const tests = require("../models/tests.model")

/** 
 * 
 * Util to check if the English test exits
 * 
 * **/

 const checkEnglishTestExists = async (test) => {

 	const testExists = await tests.findOne({name: test});

 	// Return the error that test does not exists
 	if ( !testExists ) {
 		throw new Error("Test provided does not exists")
 	}
 	return testExists;

 }

 module.exports = {
 	checkEnglishTestExists
 }