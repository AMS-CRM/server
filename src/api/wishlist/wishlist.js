const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");

const validator = require("../../validators/wishlist");
const controller = require("../../controller/wishlist/wishlist");

/**
 *
 * @API         Get /wishlist
 * @Desc        List wishlist
 * @Access      Private
 *
 **/

router.get("/", protect, controller.wishList);

/**
 *
 * @API         POST /wishlist
 * @Desc        Add a item to a wishlist
 * @Access      Private
 *
 **/

router.post("/", protect, validator.createWishList, controller.createWishList);

/**
 *
 * @API         Delete /wishlist
 * @Desc        Delete wishlist
 * @Access      Private
 *
 **/

router.delete(
  "/",
  protect,
  validator.deleteWishList,
  controller.deleteWishList
);

module.exports = router;
