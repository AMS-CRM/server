const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Payroll = require("../../models/payrolls.model");
const Contacts = require("../../models/contacts.model");
const axios = require("axios");
const mongoose = require("mongoose");

// Controller to create a new payroll
const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).setCode(673).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { _id: user } = req.user;
    const { selectAll, user: users } = req.body;
    let query = {
      users,
      status: "include",
    };

    // Check if everything was seleted
    if (selectAll) {
      query.status = "exclude";
    }

    // Get the count of existing payrolls
    const count = (await Payroll.find({ user }).count()) + 1;

    const usersIds = users.map((id) => {
      return mongoose.Types.ObjectId(id);
    });

    // Set the query for user search
    let searchQuery = {};

    if (selectAll && users.length > 0) {
      searchQuery = { _id: { $nin: usersIds } };
    }

    if (!selectAll && users.length > 0) {
      searchQuery = { _id: { $in: usersIds } };
    }
    // Compose the user payroll data
    const payrollData = await Contacts.aggregate([
      {
        $match: searchQuery,
      },
      {
        $group: {
          _id: null,
          users: { $push: "$$ROOT" },
          count: { $sum: "$payroll.amount" },
        },
      },
      {
        $project: {
          _id: 0,
          dataView: {
            $cond: {
              if: { $in: [0, "$users.payroll.amount"] },
              then: {
                status: false,
                users: {
                  $filter: {
                    input: "$users",
                    cond: { $eq: ["$$this.payroll.amount", 0] },
                  },
                },
              },
              else: {
                status: true,
                count: "$count",
                users: "$users",
              },
            },
          },
        },
      },
    ]);

    const { dataView } = payrollData[0];
    // Check if the returning status is false
    if (!dataView.status) {
      res.status(400).setCode(344).setPayload(dataView.users);
      throw new Error("Fix the error to run the payroll");
    }

    // This needs to be changed
    const finalPayrollData = dataView.users.map((user) => {
      return {
        user: user._id,
        data: user.payroll,
      };
    });

    const newPayroll = {
      payrollNo: count,
      user,
      query,
      payroll: finalPayrollData,
    };
    // Create new payroll
    /* const response = await Payroll.create(newPayroll);

    if (!response) {
      res.status(400).setCode(394);
      throw new Error("Something went wrong when creating a payroll");
    }*/

    // Send the payroll request with the payroll id
    /*const payrollRequest = await axios.post(
      process.env.PAYROLL_URL,
      { _id: response._id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.PAYROLL_TOKEN}`,
        },
      }
    );*/

    res.status(200).setPayload(dataView).setCode(877).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Get the list of the payrolls
const list = asyncHandler(async (req, res) => {
  try {
    const { _id: user } = req.user;
    // Get the list of all payrolls for a user
    const list = await Payroll.find({ user });

    if (!list) {
      res.status(400).setCode(344);
      throw new Error("No payroll has been found");
    }

    // Send back the list
    return res.status(200).setCode(243).setPayload(list).respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  create,
  list,
};
