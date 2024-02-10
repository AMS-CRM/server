const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  featuresImage: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: new Date.now(),
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "categories",
  },
});

module.exports = products = mongoose.modal("products", productSchema);
