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
  images: [
    {
      type: String,
    },
  ],
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdOn: {
    type: Date,
    default: new Date.now(),
  },
  subCategories: [categoriesSchema],
});

module.exports = Categories = mongoose.model("Categories", categoriesSchema);
