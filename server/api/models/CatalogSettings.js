const mongoose = require("mongoose");

/**
 * Shop-wide choice lists for the admin bike forms (one document, _id "catalog"). Removing an entry
 * only removes it as a choice; bikes keep whatever brand / sizes they already have.
 */
const CatalogSettingsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: "catalog" },
    brands: { type: [String], default: [] },
    /** Smallest → largest; the order the admin size picker shows them in. */
    sizes: { type: [String], default: [] },
  },
  { timestamps: true, collection: "catalog_settings" }
);

module.exports = mongoose.model("CatalogSettings", CatalogSettingsSchema);
