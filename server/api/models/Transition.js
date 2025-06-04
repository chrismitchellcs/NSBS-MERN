const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transitionSchema = new Schema(
  {
    brand: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    material: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    sizes: {
      type: String,
      required: false,
    },
    sizesa: {
      type: String,
      required: false,
    },
    sizesis: {
      type: String,
      required: false,
    },
    colors: {
      type: String,
      required: false,
    },
    availability: {
      type: String,
      required: false,
    },
    price: { type: Number, required: false },
    saleprice: { type: Number, required: false },
    images: { type: String, required: false },
    description: { type: String, required: false },
    link: { type: String, required: false },
    year: { type: Number, required: false },
    models: { type: String, required: false },
    fullName: { type: String, required: true, unique: true },
    public: { type: Boolean, required: true },
    inStock: { type: String, required: false },
    database: { type: String, required: false },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Transition", transitionSchema);
