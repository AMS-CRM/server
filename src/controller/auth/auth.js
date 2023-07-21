const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

// Get the use model
const User = require("../../models/user.model");
const Package = require("../../models/packages.model");
const Subscription = require("../../models/subscriptions.model");

// Utils
const { checkEnglishTestExists } = require("../../utils/tests");

const login = asyncHandler(async (req, res) => {
  // Check the validation errors
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    res.payload = errors.array();
    res.status(400).setCode(454);
    throw new Error("Validation error");
  }

  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res
      .setCode(233)
      .setPayload({
        _id: user.id,
        email: user.email,
        name: user.name,
        token: generateToken(user._id),
      })
      .respond();
  } else {
    res.status(400).setCode(766);
    throw new Error("Invalid credentials");
  }
});

const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty(errors)) {
    res.status(400).setCode(345).setPayload(errors.array());
    throw new Error("Validation error");
  }

  const { email, password } = req.body;

  try {
    // Check if the user already exists in the database
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      res.status(400).setCode(343);
      throw new Error("Uesr with same email address already exists");
    }

    // Get the hashed password
    const hashedPassword = await hashPassword(password);
    // Add the user to the database
    const user = await User.create({ email, password: hashedPassword });

    if (!user) {
      res.status(400).setCode(434);
      throw new Error("Something went wrong while creating a new user");
    }

    return res
      .status(200)
      .setCode(300)
      .setPayload({
        _id: user.id,
        email: user.email,
        token: generateToken(user._id),
      })
      .respond();
  } catch (error) {
    res.status(400).setCode(743);
    throw new Error(error);
  }
});

const phoneRegister = asyncHandler(async (req, res) => {
  const user = req.user;

  // Check the validation errors
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    res.payload = errors.array();
    res.status(400).setCode(454);
    throw new Error("Validation error");
  }

  if (user.name) {
    res.status(400).setCode(433);
    throw new Error("User is already registered");
  }

  try {
    const englishTest = await checkEnglishTestExists(req.body.test);

    // Get the free packages
    const packageCheck = await Package.findOne({
      name: "Free",
      test: ObjectId(englishTest._id),
    }).select("_id");

    if (!packageCheck) {
      res.status(400).setCode(453);
      throw new Error("You are not eligble for the free plan.");
    }

    // Start the user subscription
    const startSubscription = await Subscription.create({
      user: user.id,
      package: packageCheck._id,
      transactions: [
        {
          method: "Freemium",
        },
      ],
    });

    if (!startSubscription) {
      res.status(400).setCode(422);
      throw new Error("Error while starting a new Subscription");
    }

    // Create the user profile
    const profile = {
      name: req.body.name,
      email: req.body.email,
    };

    const createProfile = await User.findOneAndUpdate(user.id, profile, {
      new: true,
    });

    if (!createProfile) {
      res.status(400).setCode(344);
      throw new Error("Cannot create profile, Please contact support");
    }

    res
      .status(200)
      .setCode(234)
      .setPayload({ ...createProfile._doc, token: req.token })
      .respond();
  } catch (error) {
    res.status(400).setCode(235);
    throw new Error(error);
  }
});

const phoneLogin = asyncHandler(async (req, res) => {
  try {
    // Get the login code
    const { phone, code } = req.body;

    if (!phone || !code) {
      res.status(400);
      throw new Error("Please provide valid OTP");
    }

    // Check if the user exists
    const userExists = await User.findOne({ phone });
    const user = !userExists ? await User.create({ phone }) : userExists;

    // Set the verfication code
    let phoneNumber;
    let verification = "approved";

    if (process.env.NODE_ENV == "production") {
      phoneNumber = await verifyPhoneNumber(phone);

      verification = await verifyOneTimePassword(phoneNumber, code);
    }

    // Send the verfication code
    if (!phoneNumber || verification !== "approved") {
      res.status(400).setCode(432);
      throw new Error("Invalid OTP");
    }

    return res
      .status(200)
      .setCode(235)
      .setPayload({
        _id: user.id,
        name: user.name || null,
        email: user.email || null,
        token: generateToken(user._id),
      })
      .respond();
  } catch (error) {
    throw new Error(error);
  }
});

const sendOneTimePassword = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const phoneNumber = verifyPhoneNumber(phone);

  if (!phoneNumber) {
    res.status(400);
    throw new Error("Please provide a valid phone number");
  }

  if (process.env.NODE_ENV == "development") {
    return res.status(200).send("success");
  }

  twilioApi()
    .verifications.create({ to: phoneNumber, channel: "sms" })
    .then((verification) => res.status(200).send(verification))
    .catch((error) => res.status(400).send(error));
});

const verifyPhoneNumber = (phone) => {
  phone = parseInt(phone);
  return (`${phone}`.length == 10 && "+1" + phone) || false;
};

const verifyOneTimePassword = (to, code) => {
  return twilioApi()
    .verificationChecks.create({ to, code })
    .then((verification_check) => verification_check.status)
    .catch((error) => console.log(error));
};

const hashPassword = async (password, saltRounds = 10) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const twilioApi = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  return client.verify.v2.services("VA0d6e36df0f789c38e8af3463fa48e234");
};

module.exports = {
  login,
  register,
  phoneRegister,
  phoneLogin,
  sendOneTimePassword,
};
