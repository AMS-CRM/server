const mongoose = require("mongoose");
const Schema = mongoose.Schema();

const productSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
  },
  subCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },
  ],
  metaData: {
    type: Map,
    of: String,
  },
  varients: [
    {
      name: {
        type: String,
      },
      iconImage: {
        type: String,
      },
      price: {
        type: Number,
      },
      images: [
        {
          type: String,
        },
      ],
    },
  ],
});

module.exports = Products = mongoose.model("Products", productSchema);
