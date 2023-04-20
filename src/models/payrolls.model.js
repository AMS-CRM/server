const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const payrollsSchema = new Schema({
  payrollNo: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  query: {
    status: {
      type: String,
      enum: ["include", "exclude"],
    },
    users: [mongoose.Schema.Types.ObjectId],
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Completed", "Error"],
    default: "Pending",
  },
  createdOn: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  updatedOn: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = payrolls = mongoose.model("payrolls", payrollsSchema);
