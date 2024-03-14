const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  name: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = project = mongoose.model("projects", projectSchema);
