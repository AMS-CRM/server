/***
 * 
 *  Desc: Middleware to control the flow of the application based on the services and user roles
 *  Author: Shivdeep Singh
 * 
***/

const _ = require("lodash");
const Users = require("../models/Users.js")
const asyncHandler = require("express-async-handler");
const { Error } = require("mongoose");

module.exports = authorization = asyncHandler(async ( req, res, next ) => {
  
   // Check if user have the permission to the incoming requesting route
   const { groups } = req.user;
   const { method, originalUrl } = req;
   const requestedService = originalUrl.split("/")[2];
   const roles = _.map(groups, 'roles')[0]; // Get the roles out to the group

   try {

      let service = [];

      // Loop through each role to check permission to the current requesting service
      roles.forEach(( key ) => {
          service = key.permissions.filter( x => x.service.name.toLowerCase() == requestedService );
      });

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
          throw new Error("You don't have permission to the medtmethodhod")
        }

        // Send the request with protected route 
        req.user.permission = protected;

      }  else {
        res.status(404).setCode(784)
        throw new Error("You don't have permission to accerss this route")
    }

      next();

   } catch (err) {

       // Log the error on console
       res.status(500).setCode(757)
       throw new Error("Authorization failed")
   }

})