/***
 * 
 *  Desc: Middleware to control the flow of the application based on the services and user roles
 *  Author: Shivdeep Singh
 * 
***/

const _ = require("lodash");
const Users = require("../models/user.model.js")
const asyncHandler = require("express-async-handler");

module.exports = authorization = asyncHandler(async ( req, res, next ) => {
  
   // Check if user have the permission to the incoming requesting route
   const { group } = req.user;
   const { method, originalUrl } = req;
   const requestedService = originalUrl.split("/")[1];
   const {roles} = group;

   try {
      let service = [];

      // Loop through each role to check permission to the current requesting service
       roles.forEach(( key ) => {
        const val =  key.permissions.filter( x => x.service.name.toLowerCase() == requestedService );
        val.length && service.push(val)
      });
      console.log(service)
      if (service.length) {

        /*
        *
        * Protcted - True or false ( User only access their data ) 
        * access-Type - Read ( User cannot access delete or edit ) or full ( User can access everything )
        * 
        */
        const { accessType, protected } = service;
        const readRestrictions = [ 
          "PUT",
          "DELETE"
        ];

        if ( accessType == "Read-Only" && readRestrictions.indexOf(method) != -1) {
          res.status(404).setCode(955)
          throw new Error("You don't have permission to the access this API endpoint")
        }

        // Send the request with protected route 
        req.user.permission = protected;

      }  else {
        res.status(404).setCode(784)
        throw new Error("You don't have permission to access this route")
    }

      next();

   } catch (err) {
       // Log the error on console
       res.status(500).setCode(757)
       throw new Error(err)
   }

})