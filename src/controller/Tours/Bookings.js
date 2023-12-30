const asyncHandler = require("express-async-handler");
const { validationResult, matchedData } = require("express-validator");
const createContact = require("../../utils/createContact.js");

// Get the models
const ToursModel = require("../../models/Tours.model.js");
const BookingsModel = require("../../models/bookings.model.js");
const mongoose = require("mongoose");
// Controller to create a new bookings
const newBooking = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(244).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { tour, batch, numberOfMembers, ...contact } = matchedData(req);
    const user = req.user._id;

    const getUserBookingWithBatch = await BookingsModel.findOne({
      tour: tour,
      batch: batch,
      user: user,
    });

    // Create a new contact
    const contactCreate = await createContact(req.user._id, contact);
    if (!contactCreate) {
      throw new Error(contactCreate);
    }
    const getTourBatch = await ToursModel.findOne(
      {
        _id: tour,
      },
      { _id: 0, price: 1 }
    );

    if (!getTourBatch) {
      res.status(200).setCode(233);
      throw new Error("Something went wrong fetching a batch");
    }

    if (!getUserBookingWithBatch) {
      // Create new bookings
      // Calculate the booking amount
      const amount = getTourBatch.price * numberOfMembers;

      // Create a new booking
      const newBookingData = {
        user,
        batch,
        tour,
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
      const createNewBookings = await BookingsModel.create(newBookingData);

      if (!createNewBookings) {
        res.status(400).setCode(130);
        throw new Error("Something went wrong when createing a booking");
      }

      // Update the batch to add the new bookings
      const batchUpdateInTours = await ToursModel.findOneAndUpdate(
        {
          _id: tour,
          "batch._id": batch,
        },
        {
          $push: {
            "batch.$.bookings": createNewBookings._id,
          },
        },
        {
          new: true,
        }
      );

      if (!batchUpdateInTours) {
        res.status(400).setCode(343);
        throw new Error("Something went wrong adding new booking to a batch");
      }

      const newBookingResult = await BookingsModel.findOne({
        _id: createNewBookings._id,
      }).populate("members");
      return res
        .status(200)
        .setCode(232)
        .setPayload(newBookingResult)
        .respond();
    }

    //Update the current booking
    const updateUserBookings = await BookingsModel.findOneAndUpdate(
      {
        tour: tour,
        batch: batch,
        user: user,
      },
      {
        $push: {
          members: contactCreate._id,
        },
      },
      { new: true }
    ).populate("members");

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
    const { bookingId, user } = req.params;

    // Get the single booking
    const singleBookingData = await BookingsModel.findOne({
      _id: bookingId,
    })
      .populate("tour")
      .populate("user")
      .populate("members");

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
    // Get the single booking
    const getBookingsData = await BookingsModel.find({})
      .populate("tour")
      .populate("user")
      .populate("members");

    if (!getBookingsData) {
      res.status(200).setCode(542);
      throw new Error("Something went wrong fetching the booking");
    }

    return res.status(200).setPayload(getBookingsData).setCode(204).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Get all the bookings of a particular user
const getUsersBookingsData = asyncHandler(async (req, res) => {
  try {
    // User for which we want to fetch bookings
    const { user } = req.params;

    // Get the single booking
    const userBookings = await BookingsModel.findOne({ user })
      .populate("tour")
      .populate("user")
      .populate("members");

    if (!userBookings) {
      res.status(200).setCode(542);
      throw new Error("Something went wrong fetching the booking");
    }

    return res.status(200).setPayload(userBookings).setCode(204).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Get all the bookings of a particular user
const getLoggedInUserBookings = asyncHandler(async (req, res) => {
  try {
    // User for which we want to fetch bookings
    const user = req.user._id;

    // Get the single booking
    const userBookings = await BookingsModel.aggregate([
      {
        $match: {
          user,
        },
      },
      {
        $lookup: {
          from: "tours",
          localField: "tour",
          foreignField: "_id",
          as: "tours",
        },
      },
      {
        $unwind: "$tours",
      },
      {
        $match: {
          "tours.batch._id": { $toObjectId: "$batch" },
        },
      },
    ]);

    if (!userBookings) {
      res.status(200).setCode(542);
      throw new Error("Something went wrong fetching the booking");
    }

    return res.status(200).setPayload(userBookings).setCode(204).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Get all the bookings of a particular user
const getLoggedInUserBookingByTour = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(3454).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    // User for which we want to fetch bookings
    const user = req.user._id;
    const { tourId, batchId } = req.body;

    // Get the single booking
    const userBookings = await BookingsModel.findOne({
      user,
      tour: tourId,
      batch: batchId,
    }).populate("members");

    if (!userBookings) {
      res.status(400).setCode(542);
      throw new Error("No data found");
    }

    return res.status(200).setPayload(userBookings).setCode(204).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Get the list of the bookings within the parctiaurl batch
const getBookingsListInBatch = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(4354).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { batchId } = req.params;

    // Get the list of bookings
    const bookingsList = await BookingsModel.find({
      batch: mongoose.Types.ObjectId(batchId),
    })
      .populate("members")
      .populate("user");

    if (!bookingsList) {
      res.status(400).setCode(3245);
      throw new Error("Cannot find the bookings");
    }

    return res.status(200).setCode(234).setPayload(bookingsList).respond();
  } catch (error) {
    throw new Error("Validation error");
  }
});

const getContactBookingDetails = asyncHandler(async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(3428).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { contactId } = req.params;

    // Get the list of contact bookings
    const getContactBookings = await BookingsModel.find({
      members: {
        $in: [contactId],
      },
    })
      .populate("user")
      .populate("tour");

    if (!getContactBookings) {
      res.status(400).setCode(324);
      throw new Error("Something went wrong when fetching the bookings");
    }

    return res
      .status(200)
      .setCode(422)
      .setPayload(getContactBookings)
      .respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  newBooking,
  singleBooking,
  getBookingList,
  getUsersBookingsData,
  getBookingsListInBatch,
  getContactBookingDetails,
  getLoggedInUserBookings,
  getLoggedInUserBookingByTour,
};
