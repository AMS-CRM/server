const { body } = require("express-validator");

const createWishList = [
  body("category").notEmpty().withMessage("Invalid wishlist category"),
  body("wishlistItem").notEmpty().withMessage("Wishlist item cannot be empty"),
];

const deleteWishList = [...createWishList];

module.exports = {
  createWishList,
  deleteWishList,
};
