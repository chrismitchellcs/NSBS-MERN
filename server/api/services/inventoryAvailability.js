const mongoose = require("mongoose");
const AllBikes = require("../models/AllBikes");

function parseModelsJson(modelsJson) {
  try {
    const arr = JSON.parse(modelsJson || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function normalizeVariantKey(s) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Merge `models` + `inStock` like BikeLandingPageUpdated (prefer "In Store" when duplicate color/size).
 */
function findVariantRow(bike, color, size) {
  const want = `${normalizeVariantKey(color)}|${normalizeVariantKey(size)}`;
  const map = new Map();
  const add = (row) => {
    if (!row || row.color == null || row.size == null) return;
    const key = `${normalizeVariantKey(row.color)}|${normalizeVariantKey(
      row.size
    )}`;
    const existing = map.get(key);
    if (!existing) map.set(key, row);
    else if (
      String(row.availability || "").trim() === "In Store" &&
      String(existing.availability || "").trim() !== "In Store"
    ) {
      map.set(key, row);
    }
  };
  parseModelsJson(bike.models).forEach(add);
  parseModelsJson(bike.inStock).forEach(add);
  return map.get(want) || null;
}

/** A variant price of 0 / blank means "use the product price", never a free bike. */
function priceOrNull(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Regular + sale price for a colour + size. Variants only carry their own `price` / `saleprice`
 * when they cost more than the product's (cheapest) price. Vendor rows (`models`) are checked
 * before store stock, matching the client's `variantPricingFor`.
 */
function variantPricingForBike(bike, color, size) {
  const want = `${normalizeVariantKey(color)}|${normalizeVariantKey(size)}`;
  const match = (row) =>
    row &&
    `${normalizeVariantKey(row.color)}|${normalizeVariantKey(row.size)}` === want;
  const row =
    parseModelsJson(bike && bike.models).find(match) ||
    parseModelsJson(bike && bike.inStock).find(match) ||
    null;
  const ownPrice = priceOrNull(row && row.price);
  if (ownPrice != null) {
    return { price: ownPrice, saleprice: priceOrNull(row.saleprice) || 0 };
  }
  return {
    price: Number(bike && bike.price) || 0,
    saleprice: Number(bike && bike.saleprice) || 0,
  };
}

/**
 * Transition B2B scraped vendor availability for gating (prefer vendorAvailability if present).
 */
function vendorAvailabilityFromRow(row) {
  if (!row) return "";
  const preferred =
    row.vendorAvailability != null && String(row.vendorAvailability).trim() !== ""
      ? row.vendorAvailability
      : row.availability;
  return String(preferred || "").trim();
}

/** Low Stock (N) → N, else null. */
function parseLowStockCount(availability) {
  const m = String(availability || "").match(/low\s*stock\s*\((\d+)\)/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

/** Transition vendor stock allows special-order: In Stock, or Low Stock with N >= 3. */
function vendorAllowsSpecialOrder(availability) {
  const s = String(availability || "")
    .trim()
    .toLowerCase();
  if (!s) return false;
  if (s === "out of stock" || s === "out of stock.") return false;
  if (
    s.includes("available to order") ||
    s.includes("pre-order") ||
    s.includes("preorder")
  ) {
    return false;
  }
  const low = parseLowStockCount(availability);
  if (low != null) return low >= 3;
  return s.includes("in stock");
}

/**
 * Classify inquiry fulfillment from Mongo inventory only. Never blocks for OOS — only invalid bike/variant.
 */
async function classifyInquiryFulfillment({ bikeId, color, size }) {
  const id = bikeId != null ? String(bikeId).trim() : "";
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, code: 400, message: "Invalid bike id" };
  }

  const bike = await AllBikes.findById(id).lean();
  if (!bike || !bike.public || bike.archived) {
    return { ok: false, code: 404, message: "This bike is no longer listed." };
  }

  const row = findVariantRow(bike, color, size);
  if (!row) {
    return {
      ok: false,
      code: 404,
      message: "That size and colour was not found for this bike.",
    };
  }

  const vendorAvailability = vendorAvailabilityFromRow(row);

  if (String(row.availability || "").trim() === "In Store") {
    return {
      ok: true,
      fulfillment: "from_stock",
      payable: true,
      vendorAvailability,
      bike,
      row,
    };
  }

  const isTransition =
    String(bike.database || "").toUpperCase() === "TRANSITION";
  if (isTransition && vendorAllowsSpecialOrder(vendorAvailability)) {
    return {
      ok: true,
      fulfillment: "special_order",
      payable: true,
      vendorAvailability,
      bike,
      row,
    };
  }

  return {
    ok: true,
    fulfillment: "inquiry_only",
    payable: false,
    vendorAvailability,
    bike,
    row,
  };
}

module.exports = {
  parseModelsJson,
  findVariantRow,
  variantPricingForBike,
  vendorAllowsSpecialOrder,
  classifyInquiryFulfillment,
};
