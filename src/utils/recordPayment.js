// Get the booking model
const BookingModel = require("../models/bookings.model");

// Function to record payment
const recordPayment = async ({
  bookingId,
  paymentMethod,
  amount,
  reference,
  status,
}) => {
  try {
    const additionalUpdates = {};
    let paymentStatus = "Partially Paid";
    // Get the payment amount
    const BookingPayment = await BookingModel.findOne(
      {
        _id: bookingId,
      },
      {
        _id: 0,
        payments: 1,
      }
    );

    if (!BookingPayment) {
      throw new Error("No bookings found with the booking Id");
    }

    // Calculate the new payment
    const amountPaid = BookingPayment.payments.amountPaid + amount;
    const remaningBalance = amount - BookingPayment.payments.remaningBalance;
    if (remaningBalance == 0) {
      paymentStatus = "Paid";
      additionalUpdates["status"] = "Booked";
    }

    const newPaymentRecordData = {
      paymentMethod,
      amount,
      reference,
      status,
    };

    const recordNewPayment = await BookingModel.findOneAndUpdate(
      {
        _id: bookingId,
      },
      {
        ...additionalUpdates,
        "payments.amountPaid": amountPaid,
        "payments.remaningBalance": remaningBalance,
        "payments.status": paymentStatus,
        $push: {
          recordPayments: newPaymentRecordData,
        },
      },
      {
        new: true,
      }
    );

    if (!recordNewPayment) {
      throw new Error("Cannot record new payment");
    }

    return recordNewPayment;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = recordPayment;
