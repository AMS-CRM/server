const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Payroll = require("../../models/payrolls.model");

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

    // Get the count of existing payroll for the user
    const count = (await Payroll.find({ user }).count()) + 1;
    console.log(count);
    const newPayroll = {
      payrollNo: count,
      user,
      query,
    };

    console.log(newPayroll);

    // Create new payroll
    const response = await Payroll.create(newPayroll);

    if (!response) {
      res.status(400).setCode(394);
      throw new Error("Something went wrong when creating a payroll");
    }

    res.status(200).setPayload(response).setCode(877).respond();
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
