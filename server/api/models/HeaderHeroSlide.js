const mongoose = require("mongoose");

const headerHeroSlideSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    imageAlt: { type: String, default: "" },
    headline: { type: String, required: true },
    body: { type: String, default: "" },
    ctaLabel: { type: String, default: "Shop bikes" },
    ctaPath: { type: String, default: "/shop" },
    objectPosition: { type: String, default: "center bottom" },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeaderHeroSlide", headerHeroSlideSchema);
