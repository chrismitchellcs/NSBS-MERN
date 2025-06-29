const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bikeSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    // sizes: [
    //   {
    //     size: { type: String },
    //     _id: false,
    //   },
    // ],
    sizes: {
      type: String,
      required: true,
    },
    sizesa: {
      type: String,
      required: true,
    },
    sizesis: {
      type: String,
      required: true,
    },
    colors: {
      type: String,
      required: true,
    },
    availability: {
      type: String,
      required: true,
    },
    price: { type: Number, required: true },
    saleprice: { type: Number, required: false },
    images: { type: String, required: false },
    description: { type: String, required: false },
    link: { type: String, required: false },
    year: { type: Number, required: false },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Bike", bikeSchema);
