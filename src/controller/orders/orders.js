const asyncHandler = require("express-async-handler");
const { validationResult, matchedData } = require("express-validator");
const OrdersModel = require("../../models/orders.model.js");

// Controller to create new order
const createNewOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(545).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    let order = matchedData(req);

    // Get all the items in the array

    // Compare the size of the array
    // Reject the request if the size does not match

    // Create a new order
    // order.user = req.user._id;
    // const createOrder = await ordersModel.create(order);

    // if (!createOrder) {
    //  res.status(400).setCode(3423);
    // throw new Error("Something went wrong when creating a new order");
    //}

    return res.setCode(823).setPayload(order).respond();
  } catch (error) {
    throw new Error();
  }
});

// Controller to list the user orders

// Controller to edit the user orders

// Controller to change the user order

module.exports = {
  createNewOrder,
};
