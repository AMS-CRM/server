const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { validationResult, matchedData } = require("express-validator");
const OrdersModel = require("../../models/orders.model.js");
const ProductsModel = require("../../models/products.model.js");

function splitArray(inputArray) {
  const result = inputArray.reduce(
    (acc, item) => {
      acc.items.push(mongoose.Types.ObjectId(item.id));
      acc.data[item.id] = { ...item };
      return acc;
    },
    { items: [], data: {} }
  );
  return result;
}

// Controller to create new order
const createNewOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(545).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    let order = matchedData(req);

    // Get the list of the IDs
    const { items, data } = splitArray(order.items);

    // Get all the items in the array
    const listItems = await ProductsModel.find({
      _id: {
        $in: items,
      },
    });

    // Reject the request if the size does not match

    if (items.length != listItems.length) {
      res.status(400).setCode(343);
      throw new Error("Not all the items available ");
    }

    let finalItemsData = [];
    let payments = { totalAmount: 0 };
    // Merge the two arrays
    listItems.forEach((item) => {
      const itemId = item._id;
      const reqItem = data[itemId];

      const amount = item.price * Number(reqItem.quantity);
      finalItemsData.push({
        item: itemId,
        quantity: reqItem.quantity,
        price: item.price,
        amount: amount,
      });
      payments.totalAmount = payments.totalAmount + amount;
    });

    const orderData = {
      user: req.user._id,
      items: finalItemsData,
      payments,
    };

    // Create a new order
    const createOrder = await OrdersModel.create(orderData);

    if (!createOrder) {
      res.status(400).setCode(3423);
      throw new Error("Something went wrong when creating a new order");
    }

    return res.setCode(823).setPayload(createOrder).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to list the user orders
const listUserOrders = asyncHandler(async (req, res) => {
  try {
    const user = req.user._id;
    const listUserOrders = await OrdersModel.findOne({
      user,
    });

    if (!listUserOrders) {
      res.status(400).setCode(343);
      throw new Error(listUserOrders);
    }

    return res.status(200).setCode(234).setPayload(343);
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to add item to the cart
const addProductToOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(200).setPayload(errors.array()).setCode(334);
    throw new Error("Validation error");
  }

  try {
    const user = req.user._id;
    const { orderId, itemId, quantity } = matchedData(req);

    // Check if the products exists
    const product = await ProductsModel.findOne({
      _id: itemId,
    });

    if (!product) {
      res.status(400).setCode(4332);
      throw new Error("Invalid product provided");
    }

    const order = await OrdersModel.findOne({
      _id: orderId,
      user: user,
    });

    if (!order) {
      res.status(400).setCode(4332);
      throw new Error("Invalid order provided");
    }

    const totalProductAmount = product.price * quantity;
    order.items.push({
      item: itemId,
      quantity,
      price: product.price,
      amount: totalProductAmount,
    });

    order.payments.totalAmount += totalProductAmount;
    console.log(order);
    const saveUpdatedOrder = await order.save();
    if (!saveUpdatedOrder) {
      res.status(400).setCode(343);
      throw new Error("Something went wrong when creating new order");
    }

    return res.status(200).setCode(243).setPayload(saveUpdatedOrder).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to edit the user orders
const removeOrderItem = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(343).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const order = matchedData(req);
    const { orderId, itemId, quantity } = order;

    const exisitingOrderData = await OrdersModel.findOne({
      user: req.user._id,
      _id: orderId,
      items: {
        $elemMatch: {
          item: itemId,
        },
      },
    });

    if (!exisitingOrderData) {
      res.status(400).setCode(548);
      throw new Error("Order or item not exists");
    }

    let updateItem = [];
    let updateItemIndex;
    exisitingOrderData.items.forEach((item, index) => {
      if (itemId == item.item) {
        updateItem = item;
        updateItemIndex = index;
      }
    });

    if (quantity == 0) {
      // Remove the item from the existing data
      exisitingOrderData.items.splice(updateItemIndex, 1);
      exisitingOrderData.payments.totalAmount -= updateItem.amount;
    } else {
      originalAmount = updateItem.amount;
      updateItem.amount = updateItem.price * quantity;
      updateItem.quantity = quantity;
      exisitingOrderData.payments.totalAmount -= originalAmount;
      exisitingOrderData.payments.totalAmount += updateItem.amount;
    }

    const saveRemovedItemResult = await exisitingOrderData.save();

    if (!saveRemovedItemResult) {
      res.status(400).setCode(3493);
      throw new Error("Something went wrong when removing the item");
    }

    return res
      .status(200)
      .setPayload(saveRemovedItemResult)
      .setCode(234)
      .respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to add an item to the order
// Controller edit the quantity of an item

module.exports = {
  createNewOrder,
  listUserOrders,
  addProductToOrder,
  removeOrderItem,
};
