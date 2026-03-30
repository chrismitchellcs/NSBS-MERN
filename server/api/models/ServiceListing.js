const mongoose = require("mongoose");

const serviceListingSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ["package", "rate"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    price: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceListing", serviceListingSchema);
