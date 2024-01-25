const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const User = require("../../models/user.model.js");

// Controll to list the wishlist
const wishList = asyncHandler(async (req, res) => {
  try {
    const user = req.user._id;
    const wishlist = await User.findOne({
      _id: user,
    }).populate("wishlist.tours");

    if (!wishlist) {
      res.status(400).setCode(6554);
      throw new Error("Cannot find any wishlist");
    }

    return res.setCode(234).setPayload(wishlist).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to create a wishlist
const createWishList = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(343).setPayload(errors.array());
    throw new Error("Validation error");
  }

  try {
    const { category, wishlistItem } = req.body;
    const user = req.user._id;

    // Create a new wishlist if the wishlist already does not exists
    const createNewList = await User.findOneAndUpdate(
      {
        _id: user,
      },
      {
        $push: {
          [`wishlist.${category}`]: "65b0335f72c8b49c7f53966b",
        },
      },
      {
        new: true,
      }
    );

    if (!createNewList) {
      res.status(400).setCode(9223);
      throw new Error("Something went wrong when create a wishlist");
    }

    return res.status(200).setCode(2343).setPayload(createNewList).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to delete a wishlist
const deleteWishList = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(343).setPayload(errors.array());
    throw new Error("Validation error");
  }
  try {
    const { category, wishlistItem } = req.body;
    const user = req.user._id;

    // Create a new wishlist if the wishlist already does not exists
    const deleteEntry = await User.findOneAndUpdate(
      {
        _id: user,
      },
      {
        $pull: {
          [`wishlist.${category}`]: "65b0335f72c8b49c7f53966b",
        },
      },
      {
        new: true,
      }
    );
    if (!deleteEntry) {
      res.status(400).setCode(9223);
      throw new Error("Something went wrong when deleting a wishlist");
    }

    return res.status(200).setCode(2343).setPayload(deleteEntry).respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  wishList,
  createWishList,
  deleteWishList,
};
