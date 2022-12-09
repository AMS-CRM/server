const asyncHanaler = require("express-async-handler");
const countries = require("../../models/countries.model.js");

const getCountries = asyncHanaler(async (req, res) => {

    try {

        // Get the list of the countries
        const countriesList = await countries.find({});

        if ( !countriesList ) {
            throw new Error("Something went wrong")
        }

        return res.status(200)
        .setCode(234)
        .setPayload(countriesList).respond()
        
    } catch(err) {

        res.status(400).setCode(439)

    }

})


module.exports = {
    getCountries
}