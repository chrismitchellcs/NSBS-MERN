const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const allBikesSchema = new Schema(
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
    /** Shop cost (one per model for Transition/Norco/OTHER; PHP POS uses this for every variant line). */
    costPrice: { type: Number, required: false },
    images: { type: String, required: false },
    description: { type: String, required: false },
    link: { type: String, required: false },
    year: { type: Number, required: false },
    models: { type: String, required: false },
    fullName: { type: String, required: true, unique: true },
    public: { type: Boolean, required: true },
    archived: { type: Boolean, required: false, default: false },
    inStock: { type: String, required: false },
    database: { type: String, required: false },
    /** Public product page views (incremented on GET /:id when public and not archived). */
    viewCount: { type: Number, required: false, default: 0 },
  },
  { timestamps: false }
);

// Same DB as ATLAS_URI; optional override for collection name (default: Mongoose plural, usually "allbikes").
const bikesCollection = process.env.BIKES_COLLECTION_NAME;
module.exports = bikesCollection
  ? mongoose.model("AllBikes", allBikesSchema, bikesCollection)
  : mongoose.model("AllBikes", allBikesSchema);
