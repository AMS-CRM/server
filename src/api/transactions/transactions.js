const express = require("express");
const router = express.Router();
const controller = require("../../controller/transactions/transactions");
const validator = require("../../validators/transactions");
const { protect } = require("../../middleware/authMiddleware");

/**
 *
 * @API   /transaction/etransfer
 * @Desc  Allow user to create e transfer request
 * @access PRIVATE
 *
 */
router.post("/etransfer", protect, validator.etransfer, controller.etransfer);

/**
 *
 * @API      /trasactions/list
 * @Desc    Get the list of all transactions for a user
 * @access  PRIVATE
 */
router.get("/list/:page", protect, controller.listTransactions);

/**
 *
 * @API     /transactions/get/:id
 * @Desc    List a single transaction
 * @Access  Private
 *
 */
router.get(
  "/:transferId",
  protect,
  validator.transaction,
  controller.getTransaction
);

/**
 *
 * @API     /transactions/create
 * @Desc    Initate a new transaction
 * @access  PRIVATE
 *
 */
router.post("/create", protect, validator.create, controller.create);

module.exports = router;
