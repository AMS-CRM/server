const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const createContact = require("../../utils/createContact.js");

// Get the models
const ToursModel = require("../../models/Tours.model.js");
const { default: mongoose } = require("mongoose");

// Controller to create a new bookings
const newBooking = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(244).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { tour, batch, numberOfMembers, ...contact } = req.body;
    const user = req.user._id;

    // Check if user already started the booking
    const getTourBatch = await ToursModel.findOne(
      {
        _id: tour,
        "batch._id": batch,
      },
      { _id: 0, batch: 1, price: 1 }
    );

    if (!getTourBatch) {
      res.status(400).setCode(324);
      throw new Error("No tour found");
    }

    const checkBookingsFromUser = getTourBatch.batch[0].bookings?.filter(
      (booking) => booking.user.toString() == user
    );

    // Create a new contact
    const contactCreate = await createContact(req.user._id, contact);
    if (!contactCreate) {
      throw new Error(contactCreate);
    }

    // Create new bookings
    if (checkBookingsFromUser.length == 0) {
      // Calculate the booking amount
      const amount = getTourBatch.price * numberOfMembers;
      // Create a new booking
      const newBookingData = {
        user,
        numberOfMembers,
        members: [contactCreate._id],
        status: "In Progress",
        payments: {
          amount,
          amountPaid: 0,
          status: "Pending",
        },
      };

      // Create a new booking
      const createNewBookings = await ToursModel.findOneAndUpdate(
        {
          _id: tour,
          "batch._id": batch,
        },
        { $push: { "batch.$.bookings": newBookingData } },
        { new: true }
      );

      if (!createNewBookings) {
        res.status(400).setCode(130);
        throw new Error("Something went wrong when createing a booking");
      }

      return res
        .status(200)
        .setCode(232)
        .setPayload(createNewBookings)
        .respond();
    }
    //Update the current booking
    const updateUserBookings = await ToursModel.findOneAndUpdate(
      {
        _id: tour,
        "batch.bookings.user": user,
      },
      {
        $push: {
          "batch.$[].bookings.$[].members": contactCreate._id,
        },
      },
      { new: true }
    );

    if (!updateUserBookings) {
      res.status(400).setCode(934);
      throw new Error("Error updating the user booking");
    }

    return res
      .status(200)
      .setCode(234)
      .setPayload(updateUserBookings)
      .respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to get the list of the bookings
const singleBooking = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(343).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { bookingId, tour } = req.params;

    // Get the single booking
    const singleBookingData = await ToursModel.aggregate([]);
    if (!singleBookingData) {
      res.status(200).setCode(342);
      throw new Error("Something went wrong fetching the booking");
    }

    return res.status(200).setPayload(singleBookingData).setCode(204).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to get a single booking
const getBookingList = asyncHandler(async (req, res) => {
  try {
  } catch (error) {}
});

module.exports = {
  newBooking,
  singleBooking,
  getBookingList,
};
