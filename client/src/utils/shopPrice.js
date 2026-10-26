/** Whole dollars for shop UI; missing / invalid -> em dash. */
export function formatCadPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

/** True when sale price should be shown. */
export function hasActiveShopSale(saleprice) {
  const n = Number(saleprice);
  return Number.isFinite(n) && n > 0;
}

function parseRows(raw) {
  try {
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/** A variant price of 0 / blank means "use the product price", never a free bike. */
function priceOrNull(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function variantKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Regular + sale price for one variant. Variants only carry their own `price` / `saleprice` when
 * they cost more than the product's (cheapest) price; otherwise the product's price applies.
 */
export function variantPricing(bike, variant) {
  const ownPrice = priceOrNull(variant?.price);
  if (ownPrice != null) {
    return { price: ownPrice, saleprice: priceOrNull(variant?.saleprice) || 0 };
  }
  return { price: Number(bike?.price) || 0, saleprice: Number(bike?.saleprice) || 0 };
}

/** What the customer pays before tax: sale price when active, else regular. */
export function effectivePrice({ price, saleprice }) {
  return hasActiveShopSale(saleprice) ? Number(saleprice) : Number(price) || 0;
}

/** True when some variants cost more than the listed price, so listings show "From $X". */
export function bikeHasVariantPricing(bike) {
  if (bike?.variantPricing) return true;
  return [...parseRows(bike?.models), ...parseRows(bike?.inStock)].some(
    (row) => priceOrNull(row?.price) != null
  );
}

/**
 * Price for a colour + size. Looks at the vendor variants (`models`, which carry per-variant
 * prices) before store stock, so the bike page, checkout, and the server charge all agree.
 */
export function variantPricingFor(bike, color, size) {
  const want = `${variantKey(color)}|${variantKey(size)}`;
  const match = (row) => row && `${variantKey(row.color)}|${variantKey(row.size)}` === want;
  const row = parseRows(bike?.models).find(match) || parseRows(bike?.inStock).find(match) || null;
  return variantPricing(bike, row);
}
