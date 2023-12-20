const contactModel = require("../models/contacts.model.js");

module.exports = async (user, contact) => {
  // Get the data from the contact
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
  } = contact;

  // Compose the data for upload
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
    const contact = await contactModel.create(data);

    if (!contact) {
      throw new Error("Error while creating a new contact");
    }

    return contact;
  } catch (error) {
    throw new Error(error);
  }
};
