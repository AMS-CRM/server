const express = require("express");
const router = express.Router();
const asyncHandler = require('express-async-handler')
const { validationResult } = require("express-validator");

// Get the models
const User = require("../../models/user.model");

const getUser = asyncHandler(async (req, res) => {

    const user = req.user;

    if (true) {
         res.status(500).setPayload({error: "error"}).setCode(33)
         throw new Error("User profile not found")
    }

    res.status(200).setCode(2002).setPayload(user).sendStatus()


})

const editUser = asyncHandler(async ( req, res ) => {

    const user = req.user;

    // Check the error from the validator
    const errors = validationResult(req)

    if ( !errors.isEmpty() ) {
        res.payload = errors.array();
        res.status(400)
        throw new Error("Validation error")
    }

    const update = {
        email: req.body.email,
        name: req.body.name
    }

    try {

        const editUser = await User.findOneAndUpdate(user.id, update, {new: true});
        return res.status(200).json({...editUser._doc, token: req.token});

    } catch (error) {
        res.status(400)
        throw new Error(error);
    }

})

module.exports =  {
    getUser,
    editUser
}

