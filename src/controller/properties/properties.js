const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

// Get the user models
const User = require("../../models/user.model");
const Properties = require("../../models/properties.model");
const propertQueueSchema = require("../../models/propertyQueue.model");

// Function to create a new property in the database
const createProperty = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setPayload(errors.array()).setCode(9312);
    throw new Error("Validation error");
  }

  try {
    // Check if landlord exists by phone number
    const landlord = await User.findOne(
      {
        phone: req.body.landlord,
      },
      { _id: 1 }
    );

    if (!landlord) {
      res.status(400).setCode(343);
      throw new Error("No landlord found with the given phone number");
    }

    // Extract the incoming data
    const { name, address1, address2, city, province, rent, postalCode } =
      req.body;

    // Check if the property already exists by postal code or name
    const findPropertyByNameAndPostalCode = await Properties.findOne({
      $or: [{ name: name }, { "address.postalCode": postalCode }],
    });

    if (findPropertyByNameAndPostalCode) {
      res.status(400).setCode(349);
      throw new Error("Property already exists");
    }

    // Compose the data
    const propertyData = {
      name,
      address: { address1, address2, city, province, postalCode },
      rent,
      landlord: landlord._id,
    };

    // Create a entry in database
    const create = await Properties.create(propertyData);

    if (!create) {
      throw new Error("Something went wront when creating new landlord");
    }

    return res.status(400).setCode(34).setPayload(create).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Add new teanet to the property
// Only property landlord can add the tenet to the property
const addTenetToProperty = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).setPayload(errors.array()).setCode(344);
    throw new Error("Validation error");
  }
  try {
    const { propertyName, tenetPhoneNumber, tenetName } = req.body;

    // Check if the requested property exists
    const propertyCheck = await Properties.findOne(
      { name: propertyName },
      { _id: 1 }
    );

    if (!propertyCheck) {
      res.status(401).setCode(343);
      throw new Error("Cannot find the property");
    }

    // Check if user already added to the platform
    const findUserByNumber = await User.findOne(
      { phone: tenetPhoneNumber },
      { _id: 1 }
    );

    if (findUserByNumber) {
      // Add the user to the platform
      const addUserToProperty = await Properties.findOneAndUpdate({
        $push: { tenet: findUserByNumber._id },
      });

      if (!addUserToProperty) {
        res.status(400).setCode(343);
        throw new Error("Something went wrong when adding a user");
      }
    }

    if (!findUserByNumber) {
      // Add the user to the wait list
      const addUserToQueue = await propertQueueSchema.create({
        name: tenetName,
        phoneNumber: tenetPhoneNumber,
        property: propertyCheck._id,
      });

      if (!addUserToQueue) {
        res.status(400).setCode(343);
        throw new Error("Something went wrong when adding a new tenet");
      }

      // Send user SMS requesting them to join the app
      console.log("User does not exists in the platform. Sending the request.");
    }

    return res
      .status(200)
      .setCode(837)
      .setPayload({ msg: "Request sent to the user" })
      .respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Register teanet with property when the phone number matches

module.exports = {
  createProperty,
  addTenetToProperty,
};
