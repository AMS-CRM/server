const express = require("express");
const router = express.Router();
const asyncHandler = require('express-async-handler')
const { validationResult } = require("express-validator");

// Get the models
const User = require("../../models/user.model");

const getUser = asyncHandler(async (req, res) => {

    const user = req.user;

    if (!user) {
         res.status(500).setCode(45)
         throw new Error("User profile not found")
    }

    res.status(200)
        .setPayload(user)
        .setCode(43)
        .respond()


})

const editUser = asyncHandler(async ( req, res ) => {

    const user = req.user;

    // Check the error from the validator
    const errors = validationResult(req)

    if ( !errors.isEmpty() ) {
        res.status(400).setCode(346).setPayload(errors.array())
        throw new Error("Validation error")
    }

    const update = {
        email: req.body.email,
        name: req.body.name
    }

    try {

        const editUser = await User.findOneAndUpdate(user.id, update, {new: true});
        return res.status(200)
        .setPayload({...editUser._doc, token: req.token})
        .setCode(24).respond()

    } catch (error) {
        res.status(400).setCode(345)
        throw new Error(error);
    }

})

module.exports =  {
    getUser,
    editUser
}

