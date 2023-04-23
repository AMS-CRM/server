const { validationResult, matchedData } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Get the models
const contacts = require("../../models/contacts.model.js");
const { find } = require("../../models/contacts.model.js");

const createContact = asyncHandler(async (req, res) => {
  // Check the validation errors
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    res.payload = errors.array();
    res.status(400).setCode(454);
    throw new Error("Validation error");
  }

  const {
    firstName,
    middleName,
    lastName,
    email,
    dob,
    passport,
    dial_code,
    phone,
    nationality,
    address,
    state,
    city,
    postalCode,
  } = req.body;
  const user = req.user._id;

  const data = {
    firstName,
    middleName,
    lastName,
    email,
    nationality,
    dob,
    passport,
    phone: {
      number: phone,
      country: dial_code,
    },
    address: {
      address,
      city,
      state,
      postalCode,
    },
    user,
  };

  try {
    // Check if the contact already exits
    const checkContact = await contacts.findOne({
      $or: [
        {
          email: email,
        },
        {
          phone: phone,
        },
      ],
    });

    if (checkContact) {
      res.status(400).setCode(543);
      throw new Error("Contact already exists with same phone or email");
    }

    const contact = await contacts.create(data);

    if (!contact) {
      throw new Error("Error while creating a new contact");
    }

    res.status(200).setCode(234).setPayload(contact).respond();
  } catch (err) {
    res.status(400).setCode(235);
    throw new Error(err);
  }
});

const getContacts = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const { page, search, keyword } = req.params;

  const PAGE_LIMIT = process.env.PAGE_LIMIT || 10;
  const STARTIN_POINT = !parseInt(page) ? 0 : page * PAGE_LIMIT - PAGE_LIMIT;
  const query =
    search && keyword ? { [search]: new RegExp(`.*${keyword}.*`) } : {};

  try {
    // Get the list of all contacts from a particular user
    const getContacts = await contacts
      .find({ user: user, ...query })
      .skip(STARTIN_POINT)
      .limit(PAGE_LIMIT);

    // Get the total count of the all contacts
    const count = await contacts.count({ user: user, ...query });

    // Return error if no contact found under the user
    if (getContacts.length === 0) {
      throw new Error("No contact found for the user");
    }

    return res
      .status(200)
      .setCode(454)
      .setPayload({
        contacts: getContacts,
        count: count,
      })
      .respond();
  } catch (err) {
    res.status(400).setCode(439);
    console.log(err);
    throw new Error(err);
  }
});

const deleteContact = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(445).setPayload(errors);
    throw new Error("Validation error");
  }

  const user = req.user._id;
  const { _id } = req.body;

  try {
    const deleteContactForUser = await contacts.remove({ user, _id });

    if (deleteContactForUser.deletedCount == 0 || !deleteContactForUser) {
      res.status(400).setCode(445);
      throw new Error("Cannot delete the contact something went wrong");
    }

    return res
      .status(200)
      .setCode(485)
      .setPayload({
        msg: "Contacts from this users has been deleted",
      })
      .respond();
  } catch (err) {
    res.status(400).setCode(345);
    console.log(err);
    throw new Error(err);
  }
});

// Controller to mass update the contact pay information
const editContactPayroll = asyncHandler(async (req, res) => {
  try {
    // Get the payroll information
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to edit a contact
const editContact = asyncHandler(async (req, res) => {
  // Validate the incoming data
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setPayload(errors.array()).setCode(394);
    throw new Error("Validation error");
  }

  try {
    const data = matchedData(req);
    const { user: contactId } = data;
    delete data.user;

    // Update the user data
    const update = await contacts.findOneAndUpdate({ _id: contactId }, data, {
      new: true,
    });

    if (!update) {
      res.status(400).setCode(343);
      throw new Error("Contact cannot be updated");
    }

    return res.status(200).setCode(845).setPayload(update).respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createContact,
  getContacts,
  deleteContact,
  editContact,
};
