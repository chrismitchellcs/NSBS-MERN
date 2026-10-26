const Transition = require("../models/Transition");
const Other = require("../models/Other");
const AllBikes = require("../models/AllBikes");
const mongoose = require("mongoose");
const {
  sendEmail,
  sendBikeEmail,
} = require("../utils/email");
const {
  destroyCloudinaryImagesFromBikeColors,
} = require("../utils/cloudinaryBikeCleanup");
const axios = require("axios");
const {
  classifyInquiryFulfillment,
  variantPricingForBike,
} = require("../services/inventoryAvailability");

/**
 * Google reCAPTCHA check. The secret goes in the POST body (never the URL) so it can't surface in
 * logged or returned axios errors.
 */
async function verifyRecaptcha(token) {
  if (typeof token !== "string" || !token || token.length > 4000) return false;
  try {
    const { data } = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      new URLSearchParams({ secret: process.env.SECRET_KEY || "", response: token }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" }, timeout: 8000 }
    );
    return Boolean(data && data.success);
  } catch (err) {
    console.error("[recaptcha] verify failed:", err.message);
    return false;
  }
}

/** Optional string field from a form: trimmed, capped, never an object. */
function formText(value, max = 5000) {
  if (value == null) return "";
  if (typeof value !== "string" && typeof value !== "number") return "";
  return String(value).trim().slice(0, max);
}

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

/** Dealer cost and internal POS fields never go to shoppers. */
const ADMIN_ONLY_BIKE_FIELDS = ["costPrice"];
const ADMIN_ONLY_VARIANT_FIELDS = ["costPrice", "phpPosItemId", "phpPosQty"];

function stripAdminOnlyVariantFields(rowsJson) {
  if (typeof rowsJson !== "string" || !rowsJson) return rowsJson;
  try {
    const rows = JSON.parse(rowsJson);
    if (!Array.isArray(rows)) return rowsJson;
    return JSON.stringify(
      rows.map((row) => {
        if (!row || typeof row !== "object") return row;
        const clean = { ...row };
        ADMIN_ONLY_VARIANT_FIELDS.forEach((key) => delete clean[key]);
        return clean;
      })
    );
  } catch {
    return rowsJson;
  }
}

/** Shopper-safe copy of a bike document (plain object or mongoose doc). */
function toPublicBike(doc) {
  if (!doc) return doc;
  const bike = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  ADMIN_ONLY_BIKE_FIELDS.forEach((key) => delete bike[key]);
  bike.models = stripAdminOnlyVariantFields(bike.models);
  bike.inStock = stripAdminOnlyVariantFields(bike.inStock);
  return bike;
}

// get all bikes
const getBikes = async (req, res) => {
  const bikes = await AllBikes.find({
    public: true,
    archived: { $ne: true },
  })
    .sort({
      brand: -1,
      name: 1,
    })
    .lean();
  res.status(200).json(bikes.map(toPublicBike));
};

/** Lighter payload for the home page carousels (no descriptions, sizes, etc.). */
const getHomePreviewBikes = async (req, res) => {
  try {
    const bikes = await AllBikes.find({
      public: true,
      archived: { $ne: true },
    })
      .select("brand name colors price saleprice type viewCount models")
      .sort({ brand: -1, name: 1 })
      .lean();
    // Variants stay off the payload; cards only need to know whether to say "From $X".
    const preview = bikes.map(({ models, ...bike }) => ({
      ...bike,
      variantPricing: parseTransitionModelsJson(models).some(
        (row) => row && row.price != null && row.price !== ""
      ),
    }));
    res.status(200).json(preview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOthers = async (req, res) => {
  const bikes = await AllBikes.find({ database: "OTHER" }).sort({
    brand: -1,
    name: 1,
  });
  res.status(200).json(bikes);
};

/** Norco B2B catalog imports are unused drafts; keep them out of broad listings. */
const EXCLUDE_NORCO_CATALOG = { database: { $ne: "NORCO" } };

const getAll = async (req, res) => {
  const bikes = await AllBikes.find(EXCLUDE_NORCO_CATALOG).sort({ brand: -1, name: 1 });
  res.status(200).json(bikes);
};

const testBikes = async (req, res) => {
  console.log("test");
  res.status(200).send("Test");
};

const getBikesByBrand = async (req, res) => {
  const brand = req.body && req.body.brand;
  if (typeof brand !== "string") return res.status(400).json({ error: "brand must be a string" });

  try {
    const bikes = await AllBikes.aggregate([
      { $match: { brand: brand, public: true, archived: { $ne: true } } },
      { $sample: { size: 20 } },
    ]);
    res.status(200).json(bikes.map(toPublicBike));
  } catch (error) {
    res.status(500).json({ error: "Could not load bikes" });
  }
};
const getBikesByType = async (req, res) => {
  const type = req.body && req.body.type;
  if (typeof type !== "string") return res.status(400).json({ error: "type must be a string" });
  try {
    const bikes = await AllBikes.find({
      type: type,
      public: true,
      archived: { $ne: true },
    })
      .sort({
        brand: 1,
        name: 1,
      })
      .lean();
    res.status(200).json(bikes.map(toPublicBike));
  } catch (error) {
    res.status(500).json({ error: "Could not load bikes" });
  }
};

// get a single bike
const getBike = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }
  const bike = await AllBikes.findById(id);

  if (!bike) {
    return res.status(404).json({ error: "No such bike" });
  }
  // Drafts are only viewable by a logged-in admin (e.g. previewing before publishing).
  if (bike.archived || (!bike.public && !(req.session && req.session.user))) {
    return res.status(404).json({ error: "No such bike" });
  }

  let payload = bike;
  const skipViewCount = ["1", "true", "yes"].includes(
    String(req.query.forCheckout || "").toLowerCase()
  );
  if (bike.public && !skipViewCount) {
    const updated = await AllBikes.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    if (updated) payload = updated;
  }

  res.status(200).json(toPublicBike(payload));
};

/** Admin: bikes with view counts for dashboard (must stay above GET /:id in routes). */
const getBikeViewStats = async (req, res) => {
  try {
    const bikes = await AllBikes.find(EXCLUDE_NORCO_CATALOG)
      .select(
        "brand name fullName public archived viewCount database type price saleprice costPrice"
      )
      .sort({ viewCount: -1, brand: 1, name: 1 })
      .limit(500)
      .lean();
    res.status(200).json(bikes);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to load view stats" });
  }
};


const createOther = async (req, res) => {
  const {
    brand,
    type,
    year,
    name,
    price,
    saleprice,
    costPrice,
    description,
    link,
    fullName,
    models,
    colors,
    public,
  } = req.body;

  const database = "OTHER";

  const priceNum = Number(price);
  const priceRounded =
    Number.isFinite(priceNum) && priceNum >= 0 ? Math.round(priceNum) : 0;

  let saleRounded;
  if (saleprice === "" || saleprice == null) {
    saleRounded = undefined;
  } else {
    const sn = Number(saleprice);
    saleRounded =
      Number.isFinite(sn) && sn > 0 ? Math.round(sn) : undefined;
  }

  const costNum = Number(costPrice);
  const costField =
    costPrice !== "" &&
    costPrice != null &&
    Number.isFinite(costNum) &&
    costNum >= 0
      ? costNum
      : undefined;

  try {
    const bike = await AllBikes.create({
      brand,
      type,
      year,
      name,
      price: priceRounded,
      ...(saleRounded !== undefined ? { saleprice: saleRounded } : {}),
      ...(costField !== undefined ? { costPrice: costField } : {}),
      description,
      link,
      fullName,
      models,
      colors,
      public: Boolean(public),
      archived: false,
      database,
    });
    const bikes = await AllBikes.find({}).sort({ brand: 1, name: 1 });
    res.status(200).json(bikes);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

function parsePrice(priceString) {
  if (!priceString || typeof priceString !== "string") return 0;
  const cleaned = priceString.replace(/[^0-9.-]+/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.round(parsed);
}

/** Matches client upload normalization so typo spacing in B2B exports still upserts one doc. */
function normalizeTransitionFullNameKey(key) {
  return String(key).replace(/\s+/g, " ").trim();
}

function parseTransitionModelsJson(modelsJson) {
  try {
    const arr = JSON.parse(modelsJson || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/**
 * Keep existing colour → photo URLs and append colours that are new in this upload (empty URL),
 * so staff can add photos for new colourways. Photo-less colours no longer in the upload are
 * dropped (e.g. SKUs that moved to another model year). Returns null if stored colors JSON is
 * unreadable.
 */
function mergeTransitionColorKeys(prevColorsJson, incomingColors) {
  let prev;
  try {
    prev = JSON.parse(prevColorsJson || "{}");
  } catch {
    return null;
  }
  if (!prev || typeof prev !== "object" || Array.isArray(prev)) return null;
  const incoming = incomingColors || {};
  const merged = {};
  Object.entries(prev).forEach(([color, url]) => {
    const hasPhoto = String(url || "").trim() !== "";
    if (hasPhoto || Object.prototype.hasOwnProperty.call(incoming, color)) {
      merged[color] = url;
    }
  });
  Object.keys(incoming).forEach((color) => {
    if (!Object.prototype.hasOwnProperty.call(merged, color)) merged[color] = "";
  });
  return merged;
}

const TRANSITION_OUT_OF_STOCK = "Out Of Stock";

function isTransitionOutOfStock(availability) {
  return String(availability || "").trim().toLowerCase() === "out of stock";
}

/**
 * Non-archived Transition products missing from a stock upload are no longer on the vendor's list,
 * so their B2B variants (`models`) are marked out of stock instead of keeping stale availability.
 * Store stock (`inStock`) is left alone. Skipped when most of the catalogue is missing, which
 * usually means a partial or filtered stock file rather than real discontinuations.
 */
async function markUnlistedTransitionProductsOutOfStock(uploadedFullNames) {
  const [unlisted, activeCount] = await Promise.all([
    AllBikes.find({
      database: "TRANSITION",
      archived: { $ne: true },
      fullName: { $nin: uploadedFullNames },
    })
      .select("fullName public models")
      .lean(),
    AllBikes.countDocuments({ database: "TRANSITION", archived: { $ne: true } }),
  ]);

  if (unlisted.length === 0) return { count: 0, items: [], skipped: false };
  if (unlisted.length > activeCount / 2) {
    return {
      count: unlisted.length,
      items: [],
      skipped: true,
      skipReason: `${unlisted.length} of ${activeCount} active Transition products are missing from this file. It looks like a partial stock list, so nothing was marked out of stock.`,
    };
  }

  const operations = [];
  const items = unlisted.map((doc) => {
    const rows = parseTransitionModelsJson(doc.models);
    let markedVariants = 0;
    const nextRows = rows.map((row) => {
      if (!row || typeof row !== "object" || isTransitionOutOfStock(row.availability)) return row;
      markedVariants += 1;
      return {
        ...row,
        availability: TRANSITION_OUT_OF_STOCK,
        vendorAvailability: TRANSITION_OUT_OF_STOCK,
      };
    });
    if (markedVariants > 0) {
      operations.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { models: JSON.stringify(nextRows) } },
        },
      });
    }
    return { fullName: doc.fullName, public: Boolean(doc.public), markedVariants };
  });

  if (operations.length > 0) await AllBikes.bulkWrite(operations);

  items.sort(
    (a, b) =>
      Number(b.public) - Number(a.public) ||
      b.markedVariants - a.markedVariants ||
      a.fullName.localeCompare(b.fullName)
  );
  return { count: items.length, items, skipped: false };
}

/** B2B upload rows omit phpPosItemId — merge from previous Mongo rows by part number. */
function mergeTransitionRowsPreservePhpIds(incomingRows, prevRows) {
  const prevByPn = new Map();
  (prevRows || []).forEach((r) => {
    if (r && r.partNumber != null) prevByPn.set(String(r.partNumber).trim(), r);
  });
  return (incomingRows || []).map((row) => {
    if (!row || row.partNumber == null) return row;
    const pn = String(row.partNumber).trim();
    const prev = prevByPn.get(pn);
    if (!prev) return row;
    const merged = { ...row };
    if (prev.phpPosItemId != null && merged.phpPosItemId == null) {
      merged.phpPosItemId = prev.phpPosItemId;
    }
    if (
      (merged.vendorAvailability == null ||
        String(merged.vendorAvailability).trim() === "") &&
      prev.vendorAvailability != null &&
      String(prev.vendorAvailability).trim() !== ""
    ) {
      merged.vendorAvailability = prev.vendorAvailability;
    }
    return merged;
  });
}

/** B2B export uses strings like "Low Stock (3)" vs "In Stock". */
function isTransitionLowStockAvailability(availability) {
  if (availability == null) return false;
  return /low\s*stock/i.test(String(availability));
}

const TRANSITION_UPLOAD_REPORT_SAMPLE = 35;
const NORCO_UPLOAD_REPORT_SAMPLE = 35;

function coerceNorcoPrice(val) {
  if (val == null || val === "") return 0;
  if (typeof val === "number" && Number.isFinite(val)) return Math.round(val);
  if (typeof val === "string") return parsePrice(val);
  return 0;
}

/** Must stay in sync with client `UploadNorco.jsx` NORCO_POS_EXCLUDED_MODEL_RE. */
const NORCO_CATALOG_EXCLUDE_RE =
  /\b(BIGFOOT|SCENE|TACTIC|SECTION|XFR|INDIE)\b/i;

function isNorcoCatalogPayloadExcluded(fullName, modelName) {
  const a = fullName == null ? "" : String(fullName);
  const b = modelName == null ? "" : String(modelName);
  return NORCO_CATALOG_EXCLUDE_RE.test(`${a} ${b}`);
}

const addNorco = async (req, res) => {
  try {
    const stock = req.body.stock;
    if (!stock || typeof stock !== "object") {
      return res.status(400).json({ message: "Missing stock object" });
    }

    const rawEntries = Object.entries(stock).map(([key, model]) => ({
      fullName: String(key).replace(/\s+/g, " ").trim(),
      model,
    }));

    const entries = rawEntries.filter(({ fullName, model }) => {
      const mname =
        typeof model?.name === "string"
          ? model.name.replace(/\s+/g, " ").trim()
          : "";
      return !isNorcoCatalogPayloadExcluded(fullName, mname);
    });

    const excludedModelCount = rawEntries.length - entries.length;

    if (entries.length === 0) {
      return res.status(200).json({
        message: "No models to upsert after exclusions",
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 0,
        excludedModelCount,
        newBikes: {
          count: 0,
          models: [],
          truncated: false,
        },
      });
    }

    const fullNames = [...new Set(entries.map((e) => e.fullName))];

    const existingDocs = await AllBikes.find({
      fullName: { $in: fullNames },
      database: "NORCO",
    })
      .select("fullName")
      .lean();

    const existingByFullName = new Set(existingDocs.map((d) => d.fullName));
    const newBikeFullNames = fullNames.filter((fn) => !existingByFullName.has(fn));

    const bikesToInsert = entries.map(({ fullName, model }) => {
      const bike = {
        brand: "Norco",
        fullName,
        name:
          typeof model.name === "string"
            ? model.name.replace(/\s+/g, " ").trim()
            : model.name,
        year: model.modelYear,
        price: coerceNorcoPrice(model.price ?? model.msrp),
        models: JSON.stringify(model.bikes),
        colors: JSON.stringify(model.colors),
        inStock: JSON.stringify([]),
        public: false,
        archived: false,
        database: "NORCO",
      };
      const sp = model.saleprice;
      if (sp != null && sp !== "") {
        bike.saleprice = coerceNorcoPrice(sp);
      }
      const cp = model.costPrice;
      if (cp != null && cp !== "") {
        const n = Number(cp);
        if (Number.isFinite(n) && n >= 0) bike.costPrice = n;
      }
      return bike;
    });

    const operations = bikesToInsert.map((bike) => {
      const updateFields = {};
      const setOnInsertFields = {};

      for (const key in bike) {
        if (bike[key] !== undefined && bike[key] !== "") {
          if (
            key === "colors" ||
            key === "public" ||
            key === "inStock" ||
            key === "archived"
          ) {
            setOnInsertFields[key] = bike[key];
          } else {
            updateFields[key] = bike[key];
          }
        }
      }

      const update = { $set: updateFields };
      if (Object.keys(setOnInsertFields).length > 0) {
        update.$setOnInsert = setOnInsertFields;
      }

      return {
        updateOne: {
          filter: { fullName: bike.fullName, database: "NORCO" },
          update,
          upsert: true,
        },
      };
    });

    const result = await AllBikes.bulkWrite(operations);

    const newBikesSample = newBikeFullNames.slice(0, NORCO_UPLOAD_REPORT_SAMPLE);

    return res.status(200).json({
      message: "Norco catalog upsert completed",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
      excludedModelCount,
      newBikes: {
        count: newBikeFullNames.length,
        models: newBikesSample,
        truncated: newBikeFullNames.length > NORCO_UPLOAD_REPORT_SAMPLE,
      },
    });
  } catch (err) {
    console.error("Error during Norco bulk upsert:", err);
    return res.status(500).json({
      message: "An error occurred during Norco bulk upsert",
      error: err.message,
    });
  }
};

const getAllNorco = async (req, res) => {
  const bikes = await AllBikes.find({
    database: "NORCO",
  }).sort({
    name: 1,
  });
  res.status(200).json(bikes);
};

const updateNorco = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }
  const update = bikeUpdateFields(req.body && req.body.newBike, { allowStock: false });
  if (!update) return res.status(400).json({ error: "Nothing to update" });

  const bike = await AllBikes.findOneAndUpdate({ _id: id, database: "NORCO" }, { $set: update }, { new: true });
  if (!bike) {
    return res.status(404).json({ error: "No such bike" });
  }

  res.status(200).json(bike);
};

/** Norco B2B catalog — deletes Mongo doc and Cloudinary assets from colors/images JSON. */
const deleteNorco = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }
  try {
    const doc = await AllBikes.findById(id).lean();
    if (!doc || doc.database !== "NORCO") {
      return res.status(404).json({ error: "No such bike" });
    }
    await destroyCloudinaryImagesFromBikeColors(doc.colors, doc.images);
    await AllBikes.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Delete failed" });
  }
};

/** Remove every NORCO doc whose fullName/name matches the same exclusion list as POS import. */
const purgeNorcoExcludedModels = async (req, res) => {
  try {
    const docs = await AllBikes.find({ database: "NORCO" }).lean();
    const toDelete = docs.filter((d) =>
      isNorcoCatalogPayloadExcluded(d.fullName, d.name)
    );
    for (const doc of toDelete) {
      await destroyCloudinaryImagesFromBikeColors(doc.colors, doc.images);
      await AllBikes.findByIdAndDelete(doc._id);
    }
    const fullNames = toDelete.map((d) => d.fullName);
    res.status(200).json({
      message: "Removed Norco catalog entries matching excluded model names",
      deletedCount: toDelete.length,
      fullNames: fullNames.slice(0, 100),
      truncated: fullNames.length > 100,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Purge failed" });
  }
};

const addTransitions = async (req, res) => {
  try {
    const bikes = req.body.stock;
    if (!bikes || typeof bikes !== "object") {
      return res.status(400).json({ message: "Missing stock object" });
    }

    const entries = Object.entries(bikes).map(([key, model]) => ({
      fullName: normalizeTransitionFullNameKey(key),
      model,
    }));

    const fullNames = [...new Set(entries.map((e) => e.fullName))];

    const existingDocs = await AllBikes.find({
      fullName: { $in: fullNames },
      database: "TRANSITION",
    })
      .select("fullName models colors price saleprice costPrice name brand")
      .lean();

    const existingByFullName = new Map(existingDocs.map((d) => [d.fullName, d]));

    const newlyLowStock = [];
    for (const { fullName, model } of entries) {
      const prevDoc = existingByFullName.get(fullName);
      const prevRows = prevDoc ? parseTransitionModelsJson(prevDoc.models) : null;
      if (!prevRows || !Array.isArray(model.bikes)) continue;

      const prevByPart = {};
      prevRows.forEach((row) => {
        if (row && row.partNumber != null) {
          prevByPart[String(row.partNumber)] = String(
            row.availability || ""
          ).trim();
        }
      });

      for (const row of model.bikes) {
        if (!row || row.partNumber == null) continue;
        const pn = String(row.partNumber);
        if (!Object.prototype.hasOwnProperty.call(prevByPart, pn)) continue;
        const prevAv = prevByPart[pn];
        const nextAv = String(row.availability || "").trim();
        if (
          !isTransitionLowStockAvailability(prevAv) &&
          isTransitionLowStockAvailability(nextAv)
        ) {
          newlyLowStock.push({
            fullName,
            partNumber: pn,
            size: row.size,
            color: row.color,
            previousAvailability: prevAv || "—",
            currentAvailability: nextAv,
          });
        }
      }
    }

    const newBikeFullNames = fullNames.filter(
      (fn) => !existingByFullName.has(fn)
    );

    const mergedColorsByFullName = new Map();
    const bikesToInsert = entries.map(({ fullName, model }) => {
      const prevDoc = existingByFullName.get(fullName);
      const prevRows = prevDoc ? parseTransitionModelsJson(prevDoc.models) : [];
      const mergedColors = prevDoc
        ? mergeTransitionColorKeys(prevDoc.colors, model.colors)
        : null;
      if (mergedColors) mergedColorsByFullName.set(fullName, mergedColors);
      const withVendorAv = (Array.isArray(model.bikes) ? model.bikes : []).map(
        (row) => {
          if (!row || typeof row !== "object") return row;
          const av =
            row.vendorAvailability != null &&
            String(row.vendorAvailability).trim() !== ""
              ? row.vendorAvailability
              : row.availability;
          return { ...row, vendorAvailability: av };
        }
      );
      const mergedBikes = mergeTransitionRowsPreservePhpIds(
        withVendorAv,
        prevRows
      );
      const bike = {
        brand: "Transition",
        fullName,
        name:
          typeof model.name === "string"
            ? model.name.replace(/\s+/g, " ").trim()
            : model.name,
        year: model.modelYear,
        price: parsePrice(model.regularRetail),
        saleprice: parsePrice(model.saleRetail),
        models: JSON.stringify(mergedBikes),
        colors: JSON.stringify(mergedColors || model.colors),
        inStock: JSON.stringify([]),
        public: false,
        archived: false,
        database: "TRANSITION",
      };
      const cp = model.costPrice;
      if (cp != null && cp !== "") {
        const n = Number(cp);
        if (Number.isFinite(n) && n >= 0) bike.costPrice = n;
      }
      return bike;
    });

    const operations = bikesToInsert.map((bike) => {
      const updateFields = {};
      const setOnInsertFields = {};

      for (const key in bike) {
        if (bike[key] !== undefined && bike[key] !== "") {
          if (key === "colors" && mergedColorsByFullName.has(bike.fullName)) {
            updateFields[key] = bike[key];
          } else if (
            key === "colors" ||
            key === "public" ||
            key === "inStock" ||
            key === "archived"
          ) {
            setOnInsertFields[key] = bike[key];
          } else {
            updateFields[key] = bike[key];
          }
        }
      }

      const update = { $set: updateFields };
      if (Object.keys(setOnInsertFields).length > 0) {
        update.$setOnInsert = setOnInsertFields;
      }

      return {
        updateOne: {
          filter: {
            fullName: bike.fullName,
            $or: [{ database: "TRANSITION" }, { database: { $exists: false } }],
          },
          update,
          upsert: true,
        },
      };
    });

    const result = await AllBikes.bulkWrite(operations);
    console.log(`Matched: ${result.matchedCount}`);
    console.log(`Inserted: ${result.upsertedCount}`);
    console.log(`Modified: ${result.modifiedCount}`);

    const newBikesSample = newBikeFullNames.slice(0, TRANSITION_UPLOAD_REPORT_SAMPLE);
    const newlyLowSample = newlyLowStock.slice(0, TRANSITION_UPLOAD_REPORT_SAMPLE);

    const noLongerListed = await markUnlistedTransitionProductsOutOfStock(fullNames);
    if (noLongerListed.skipped) console.warn(`[addTransitions] ${noLongerListed.skipReason}`);

    return res.status(200).json({
      message: "Bulk upsert completed successfully",
      noLongerListed,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
      newBikes: {
        count: newBikeFullNames.length,
        models: newBikesSample,
        truncated: newBikeFullNames.length > TRANSITION_UPLOAD_REPORT_SAMPLE,
      },
      newlyLowStock: {
        count: newlyLowStock.length,
        items: newlyLowSample,
        truncated: newlyLowStock.length > TRANSITION_UPLOAD_REPORT_SAMPLE,
      },
    });
  } catch (err) {
    console.error("Error during bulk upsert:", err);
    return res.status(500).json({
      message: "An error occurred during bulk upsert",
      error: err.message,
    });
  }
};

const getTransitions = async (req, res) => {
  const bikes = await AllBikes.find({
    database: "TRANSITION",
    public: true,
    archived: { $ne: true },
  })
    .sort({
      name: 1,
    })
    .lean();
  res.status(200).json(bikes.map(toPublicBike));
};

/** Admin edits never change a bike's identity, catalog, or shopper view count. */
const PROTECTED_BIKE_FIELDS = ["_id", "__v", "database", "viewCount"];
/** Stock on Transition / Norco bikes comes from vendor uploads; their edit screens never send it. */
const UPLOAD_OWNED_FIELDS = ["models", "inStock"];

/**
 * Only the fields an admin edit actually sent, minus protected ones, so a stale admin tab can't
 * roll back stock from a newer upload or reset view counts.
 */
function bikeUpdateFields(newBike, { allowStock }) {
  if (!newBike || typeof newBike !== "object" || Array.isArray(newBike)) return null;
  const update = {};
  Object.entries(newBike).forEach(([key, value]) => {
    if (key.startsWith("$") || key.includes(".")) return;
    if (PROTECTED_BIKE_FIELDS.includes(key)) return;
    if (!allowStock && UPLOAD_OWNED_FIELDS.includes(key)) return;
    update[key] = value;
  });
  return Object.keys(update).length ? update : null;
}

const getAllTransitions = async (req, res) => {
  const bikes = await AllBikes.find({
    database: "TRANSITION",
  }).sort({
    name: 1,
  });
  res.status(200).json(bikes);
};

const updateTransition = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }
  const update = bikeUpdateFields(req.body && req.body.newBike, { allowStock: false });
  if (!update) return res.status(400).json({ error: "Nothing to update" });

  const bike = await AllBikes.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });
  if (!bike) {
    return res.status(404).json({ error: "No such bike" });
  }

  res.status(200).json(bike);
};

const updateOther = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }
  const update = bikeUpdateFields(req.body && req.body.newBike, { allowStock: true });
  if (!update) return res.status(400).json({ error: "Nothing to update" });

  const bike = await AllBikes.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });
  if (!bike) {
    return res.status(404).json({ error: "No such bike" });
  }

  res.status(200).json(bike);
};

/** OTHER catalog bikes only — deletes Mongo doc and Cloudinary assets from colors/images JSON. */
const deleteOther = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }
  try {
    const doc = await AllBikes.findById(id).lean();
    if (!doc || doc.database !== "OTHER") {
      return res.status(404).json({ error: "No such bike" });
    }
    await destroyCloudinaryImagesFromBikeColors(doc.colors, doc.images);
    await AllBikes.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Delete failed" });
  }
};



const sendForm = async (req, res) => {
  const body = req.body || {};
  const name = formText(body.name, 200);
  const email = formText(body.email, 320);
  const subject = formText(body.subject, 200);
  const message = formText(body.message, 10000);
  if (!name || !EMAIL_RE.test(email)) {
    return res.status(400).json({ message: "Please include your name and a valid email." });
  }

  try {
    if (!(await verifyRecaptcha(body.token))) {
      return res.status(400).json({ message: "reCAPTCHA check failed. Please try again." });
    }
    await sendEmail(name, email, subject, message);
    return res.status(200).send();
  } catch (error) {
    console.error("[sendForm]", error.message);
    return res.status(500).json({ message: "We couldn't send your message. Please email us directly." });
  }
};

/**
 * Same rules as checkout UI: the chosen variant's price when it has its own, else the bike's;
 * positive saleprice wins, else price; 5% tax (BC); 2dp rounding.
 * @returns {{ subTotal: number, tax: number, total: number } | null}
 */
function computeCheckoutChargeCadFromBike(bike, color, size) {
  if (!bike || typeof bike !== "object") return null;
  const { price, saleprice } = variantPricingForBike(bike, color, size);
  const subTotal = Number(saleprice) > 0 ? Number(saleprice) : Number(price) || 0;
  if (!Number.isFinite(subTotal) || subTotal < 0.01) return null;
  const tax = Math.round(subTotal * 0.05 * 100) / 100;
  const total = Math.round((subTotal + tax) * 100) / 100;
  return { subTotal, tax, total };
}

const sendBikeForm = async (req, res) => {
  const body = req.body || {};
  const token = body.token;
  const bikeprice = body.bikeprice;
  const [
    bike,
    bikecolor,
    bikesize,
    bikeavailability,
    bikeid,
    name,
    email,
    phone,
    deliveryOption,
    firstName,
    lastName,
    address,
    apartmentSuite,
    city,
    province,
    postalCode,
    message,
  ] = [
    "bike",
    "bikecolor",
    "bikesize",
    "bikeavailability",
    "bikeid",
    "name",
    "email",
    "phone",
    "deliveryOption",
    "firstName",
    "lastName",
    "address",
    "apartmentSuite",
    "city",
    "province",
    "postalCode",
    "message",
  ].map((key) => formText(body[key], key === "message" ? 10000 : 300));

  if (!name || !EMAIL_RE.test(email) || !bikeid) {
    return res.status(400).json({ message: "Please include your name and a valid email." });
  }

  try {
    if (!(await verifyRecaptcha(token))) {
      return res.status(400).json({ message: "reCAPTCHA check failed. Please try again." });
    }

    const classified = await classifyInquiryFulfillment({
      bikeId: bikeid,
      color: bikecolor,
      size: bikesize,
    });
    if (!classified.ok) {
      return res.status(classified.code || 400).json({
        message: classified.message || "Unable to process this inquiry",
      });
    }

    const fulfillmentMeta = {
      fulfillment: classified.fulfillment,
      payable: classified.payable,
      vendorAvailability: classified.vendorAvailability,
    };

    const bikeForPrice =
      classified.bike || (await AllBikes.findById(bikeid).lean());
    const priceBreakdown = computeCheckoutChargeCadFromBike(
      bikeForPrice,
      bikecolor,
      bikesize
    );
    const bikepriceForEmail =
      priceBreakdown != null
        ? priceBreakdown.subTotal
        : Number.isFinite(Number(bikeprice))
        ? Number(bikeprice)
        : bikeprice;

    await sendBikeEmail(
      token,
      bike,
      bikecolor,
      bikesize,
      bikepriceForEmail,
      bikeavailability,
      bikeid,
      name,
      email,
      phone,
      deliveryOption,
      firstName,
      lastName,
      address,
      apartmentSuite,
      city,
      province,
      postalCode,
      message,
      fulfillmentMeta
    );
    return res.status(200).json({
      ok: true,
      fulfillment: classified.fulfillment,
      payable: classified.payable,
    });
  } catch (error) {
    console.error("[sendBikeForm]", error.message);
    return res.status(500).json({
      message: "We couldn't send your inquiry. Please call or email the shop.",
    });
  }
};

const checkPassword = async (req, res) => {
  res.status(200).send("");
};

module.exports = {
  createOther,
  getBikes,
  getOthers,
  getBike,
  getBikeViewStats,
  addTransitions,
  addNorco,
  deleteNorco,
  purgeNorcoExcludedModels,
  getAll,
  getTransitions,
  getAllNorco,
  updateTransition,
  updateNorco,
  sendForm,
  sendBikeForm,
  checkPassword,
  getBikesByType,
  getBikesByBrand,
  getHomePreviewBikes,
  testBikes,
  getAllTransitions,
  updateOther,
  deleteOther,
};
