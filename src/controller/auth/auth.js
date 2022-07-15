const asyncHandler = require('express-async-handler')
const jwt = require("jsonwebtoken");
const ObjectId = require('mongodb').ObjectID;
const { validationResult } = require("express-validator")

// Get the use model
const User = require("../../models/user.model");
const Package = require("../../models/packages.model")
const Subscription = require("../../models/subscriptions.model")

// Utils
const {checkEnglishTestExists} = require("../../utils/tests");



const register = asyncHandler(async(req, res) => {

    const user = req.user;

    // Check the validation errors
    const errors = await validationResult(req);
    if ( !errors.isEmpty() ) {
        res.payload = errors.array();
        res.status(400).setCode(454)
        throw new Error("Validation error")   
    }


    if ( user.name ) {
        res.status(400).setCode(433)
        throw new Error("User is already registered")   
    }


    try {

        const englishTest = await checkEnglishTestExists( req.body.test )

        // Get the free packages
        const packageCheck = await Package.findOne({
            name: "Free",
            test: ObjectId(englishTest._id)
        }).select("_id")

        if ( !packageCheck ) {
            res.status(400).setCode(453)
            throw new Error("You are not eligble for the free plan.")
        }

        // Start the user subscription
        const startSubscription = await Subscription.create({
            user: user.id,
            package: packageCheck._id,
            transactions: [{
                method: "Freemium",
            }]
        })

        if ( !startSubscription ) {
            res.status(400).setCode(422)
            throw new Error("Error while starting a new Subscription")

        }
 
        // Create the user profile
        const profile = {
            name: req.body.name,
            email: req.body.email,
        }

        const createProfile = await User.findOneAndUpdate(
            user.id, 
            profile, 
            {new: true});

        if ( !createProfile ) {
            res.status(400).setCode(344)
            throw new Error("Cannot create profile, Please contact support")
        }

        res.status(200)
        .setCode(234)
        .setPayload({...createProfile._doc, token: req.token}).respond()

    } catch (error) {
        res.status(400).setCode(235)
        throw new Error(error)
    }
   







})

const login = asyncHandler(async (req, res) => {

  // Get the login code 
   const { phone, code } = req.body;

    if (!phone || !code) {
         res.status(400)
        throw new Error("Please provide valid OTP")
    }

    // Check if the user exists
    const userExists = await User.findOne({ phone });
    const user = !userExists ? await User.create({  phone }) : userExists;
 
    // Generate the JWT token 
    const phoneNumber = verifyPhoneNumber(phone);
   
     
    const verification = await verifyOneTimePassword(phoneNumber, code);
    
    if (!phoneNumber || verification !== "approved") {
        res.status(400)
        throw new Error("Invalid OTP");
    
    } 

    return res.status(200).setCode(235).setPayload({
      _id: user.id,
      name: user.name || null,
      email: user.email || null,
      token: generateToken(user._id)
    }).respond();

});


const sendOneTimePassword = asyncHandler(async (req,res) => {
    
    const { phone } = req.body;
    const phoneNumber = verifyPhoneNumber(phone);

    if (!phoneNumber) {
        res.status(400)
        throw new Error("Please provide a valid phone number")
    }

    //return res.status(200).send("success")

    twilioApi().verifications
    .create({to: phoneNumber, channel: 'sms'})
    .then(verification =>  res.status(200).send(verification))
    .catch(error =>  res.status(400).send(error)); 
})

const verifyPhoneNumber = (phone) => {
    phone = parseInt(phone);
    return (`${phone}`.length == 10) && "+1" + phone || false
}

const verifyOneTimePassword = (to, code) =>  {

    return twilioApi().verificationChecks
    .create({to, code})
    .then(verification_check => verification_check.status)
    .catch(error => console.log(error))

}
    

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })
  }

  const twilioApi = () => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    return client.verify.services('VA0d6e36df0f789c38e8af3463fa48e234')
}

module.exports = {
    login,
    register,
    sendOneTimePassword
}