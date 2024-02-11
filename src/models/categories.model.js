const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categoriesSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  iconImage: {
    type: String,
    required: true,
  },
  featureImage: [
    {
      type: String,
      required: false,
    },
  ],
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  subCategories: [
    {
      type: String,
      ref: "categories",
    },
  ],
});

module.exports = Categories = mongoose.model("Categories", categoriesSchema);
