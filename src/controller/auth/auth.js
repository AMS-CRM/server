const asyncHandler = require('express-async-handler')
const jwt = require("jsonwebtoken");
 
// Get the use model
const User = require("../../models/user.model");

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
   
     /*
    const verification = await verifyOneTimePassword(phoneNumber, code);
    
    if (!phoneNumber || verification !== "approved") {
        res.status(400)
        throw new Error("Invalid OTP");
    }*/
    
 

    return res.status(200).json({
      _id: user.id,
      name: user.name || null,
      email: user.email || null,
      token: generateToken(user._id)
    });

});


const sendOneTimePassword = asyncHandler(async (req,res) => {
    
    const { phone } = req.body;
    const phoneNumber = verifyPhoneNumber(phone);

    if (!phoneNumber) {
        res.status(400)
        throw new Error("Please provide a valid phone number")
    }

    return res.status(200).send("success")
/*
    twilioApi().verifications
    .create({to: phoneNumber, channel: 'sms'})
    .then(verification =>  res.status(200).send(verification))
    .catch(error =>  res.status(400).send(error)); */
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
    sendOneTimePassword
}