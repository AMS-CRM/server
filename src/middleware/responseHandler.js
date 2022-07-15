// Middelware to handle the response
const uuid = require("uuid");
const mongoose = require("mongoose");
const logger = require("./logger.js");
/**
 * 
 * @param {}  
 * @returns Json response 
 * @Desc This reponse handler required code
 * 
 */
function responseHandler(data) {

    // Get the resonse status
    const status = this.statusCode || 200

    if ( !this.code ) {
        this.code(3445)
        throw new Error("Internal error occured, Please contact support.");
    }

     try {

        if ( this.requestID != "" ) {

           // logger(req, res, next)
            // Send the response
             return this.json({
                "success": status && status == 200 ? true : false,
                "code": this.code,
                "status": status,
                "data": this.payload || null,
                "requestID": this.requestID,
            }) 

        } else {
            throw new Error('Whoops! Something went wrong please contact support.') 
        }

   } catch (err) {
        console.error(`Error: ${err}`)
        throw new Error(err)
   }
}

module.exports = {
  responseHandler
}