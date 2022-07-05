const tests = require("../models/tests.model")
const modules = require("../models/modules.model")

/** 
 * 
 * Util to check if the English test exits
 * 
 * **/

 const getTestList = async () => {

    const testList = await tests.find({}).populate("modules");

    // Return the test list
    if ( !testList ) {
        throw new Error("Something went wrong when fetching tests");
    }

    return testList;

 }

 const checkEnglishTestExists = async (test) => {

 	const testExists = await tests.findOne({name: test});

 	// Return the error that test does not exists
 	if ( !testExists ) {
 		throw new Error("Test provided does not exists")
 	}
 	return testExists;

 }

 module.exports = {
 	checkEnglishTestExists,
   getTestList
 }