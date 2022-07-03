const express = require("express");
const router = express.Router();
const asyncHandler = require('express-async-handler')
const { validationResult } = require("express-validator");

// Get the models
const User = require("../../models/user.model");

const getUser = (req, res) => {

    const user = req.user;
    return res.status(200).json(user);

}

const editUser = asyncHandler(async ( req, res ) => {

    const user = req.user;


    // Check the error from the validator
    const errors = validationResult(req)

    if ( !errors.isEmpty() ) {
        res.error = errors.array();
        res.status(400)
        throw new Error("Validation error")
    }

    const update = {
        email: req.body.email,
        name: req.body.name
    }

    try {

        const editUser = await User.findOneAndUpdate(user.id, update, {new: true});
        return res.status(200).json(editUser);

    } catch (error) {
        res.status(400)
        throw new Error(error);
    }

})

module.exports =  {
    getUser,
    editUser
}

