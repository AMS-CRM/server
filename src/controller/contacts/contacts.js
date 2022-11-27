const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Get the models
const contacts = require("../../models/contacts.model.js");
const { find } = require("../../models/contacts.model.js");

const createContact = asyncHandler(async (req, res) => {


    // Check the validation errors
    const errors = await validationResult(req);
    if ( !errors.isEmpty() ) {
        res.payload = errors.array();
        res.status(400).setCode(454)
        throw new Error("Validation error")   
    }

    const { name, email, phone, address  } = req.body;
    const user = req.user._id

    try {

        // Check if the contact already exits
        const checkContact = await contacts.findOne({
            $or: [{
                "email": email,
             }, {
                "phone": phone
             }]
        });

        if ( checkContact ) {
             res.status(400).setCode(543)
             throw new Error("Contact already exists with same phone or email")
        }

        const contact =  await contacts.create({
            name, 
            email,
            address, 
            phone,
            user
        });
        
        if ( !contact ) {
            throw new Error("Error while creating a new contact")
        }

        res.status(200)
        .setCode(234)
        .setPayload(contact).respond()

    } catch(err) {
        res.status(400).setCode(235)
        throw new Error(err)
    }

})


const getContacts = asyncHandler(async(req, res) => {

    const user = req.user._id;
    const { page, search, keyword } = req.params;

    const PAGE_LIMIT =  ( process.env.PAGE_LIMIT || 10 )
    const STARTIN_POINT = ( !parseInt(page) ) ? 0 : (page * PAGE_LIMIT) - PAGE_LIMIT;
    const query = ( search && keyword ) ? {[search]: new RegExp(`.*${keyword}.*`)} : {}

    try {
  
        // Get the list of all contacts from a particular user
        const getContacts = await contacts.find({ user: user, ...query })
        .skip(STARTIN_POINT)
        .limit(PAGE_LIMIT);

        // Get the total count of the all contacts 
        const count = await contacts.count({ user: user, ...query})

        // Return error if no contact found under the user
        if ( getContacts.length === 0 ) {
            throw new Error("No contact found for the user")
        }

        return res.status(200).setCode(454).setPayload({
            contacts: getContacts,
            count: count
        }).respond()

    } catch ( err ) {
        res.status(400).setCode(439)
        console.log(err)
        throw new Error(err)
    }

})

const deleteContact = asyncHandler(async ( req, res ) => {

    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        res.status(400).setCode(445).setPayload(errors)
        throw new Error("Validation error")
    }

    const user = req.user._id;
    const { email } = req.body;

    try {

        const deleteContactForUser = await contacts.remove({ user, email });

        if ( deleteContactForUser.deletedCount == 0 || !deleteContactForUser ) {
            res.status(400).setCode(445)
            throw new Error("Cannot delete the contact something went wrong")
        }

        return res.status(200).setCode(485).setPayload({
            msg: "Contacts from this users has been deleted"
        }).respond()

    } catch (err) {
        res.status(400).setCode(345)
        console.log(err)
        throw new Error(err)
    }

})

const editContact = asyncHandler(async(req, res) => {

    
  // Check the validation errors
  const errors = await validationResult(req);
  if ( !errors.isEmpty() ) {
      res.payload = errors.array();
      res.status(400).setCode(454)
      throw new Error("Validation error")   
  }

  const { name, email  } = req.body;
  const user = req.user._id

  try {

      // Check if the contact already exits
      const checkContact = await contacts.findOne({email: email});

      if ( checkContact ) {
           res.status(400).setCode(543)
           throw new Error("Contact with the same email already exists")
      }

      const contact =  await contacts.create({
          name, 
          email,
          user
      });
      
      if ( !contact ) {
          throw new Error("Error while creating a new contact")
      }

      res.status(200)
      .setCode(234)
      .setPayload(contact).respond()

  } catch(err) {
      res.status(400).setCode(235)
      throw new Error(err)
  }

})



module.exports = {
    createContact,
    getContacts,
    deleteContact
}