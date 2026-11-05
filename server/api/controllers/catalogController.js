const CatalogSettings = require("../models/CatalogSettings");

/** What the admin forms offered before these lists were editable. */
const DEFAULT_BRANDS = ["Norco", "Ibis", "Transition"];
const DEFAULT_SIZES = [
  '10"',
  '12"',
  '14"',
  '16"',
  '20"',
  '24"',
  "Short",
  "Long",
  "X-Long",
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "1",
  "2",
  "3",
  "4",
  "5",
];

const MAX_ENTRIES = 200;
const MAX_LENGTH = 60;

/** Trimmed, de-duplicated (case-insensitive, first spelling wins) list of short strings, or null. */
function cleanList(value) {
  if (!Array.isArray(value) || value.length > MAX_ENTRIES) return null;
  const seen = new Set();
  const out = [];
  for (const item of value) {
    if (typeof item !== "string") return null;
    const text = item.replace(/\s+/g, " ").trim().slice(0, MAX_LENGTH);
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    out.push(text);
  }
  return out;
}

async function loadSettings() {
  const doc = await CatalogSettings.findById("catalog").lean();
  return {
    brands: doc && Array.isArray(doc.brands) ? doc.brands : DEFAULT_BRANDS,
    sizes: doc && Array.isArray(doc.sizes) ? doc.sizes : DEFAULT_SIZES,
  };
}

const getCatalog = async (req, res) => {
  res.status(200).json(await loadSettings());
};

/** Saves whichever of `brands` / `sizes` was sent; the other list is left as it is. */
const updateCatalog = async (req, res) => {
  const body = req.body || {};
  const update = {};
  if (body.brands !== undefined) {
    const brands = cleanList(body.brands);
    if (!brands) return res.status(400).json({ error: "brands must be a list of names" });
    update.brands = brands;
  }
  if (body.sizes !== undefined) {
    const sizes = cleanList(body.sizes);
    if (!sizes) return res.status(400).json({ error: "sizes must be a list of sizes" });
    update.sizes = sizes;
  }
  if (!Object.keys(update).length) return res.status(400).json({ error: "Nothing to update" });

  const current = await loadSettings();
  const doc = await CatalogSettings.findByIdAndUpdate(
    "catalog",
    { $set: { ...current, ...update } },
    { upsert: true, new: true }
  ).lean();
  res.status(200).json({ brands: doc.brands, sizes: doc.sizes });
};

module.exports = { getCatalog, updateCatalog, DEFAULT_BRANDS, DEFAULT_SIZES };
