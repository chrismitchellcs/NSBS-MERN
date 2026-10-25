import { getBikeFirstImageUrl } from "utils/bikeDisplay";

export const SHOP_BRANDS = ["Transition", "Norco", "Ibis"];

export const SHOP_TYPES = [
  "DH",
  "Enduro / All Mountain",
  "Trail",
  "XC",
  "Dirt Jumper",
  "Recreational",
  "Kids",
  "E-Bike",
  "Frameset",
];

export const SHOP_SORTS = [
  { value: "default", label: "Featured" },
  { value: "asc", label: "Price: Low to High" },
  { value: "desc", label: "Price: High to Low" },
];

const LIST_SEPARATOR = ",";

function splitList(value, allowed) {
  if (!value) return [];
  const byLower = new Map(allowed.map((v) => [v.toLowerCase(), v]));
  return [
    ...new Set(
      value
        .split(LIST_SEPARATOR)
        .map((v) => byLower.get(v.trim().toLowerCase()))
        .filter(Boolean)
    ),
  ];
}

/** "transition" → "Transition" (or null when it isn't a shop brand). */
export function normalizeShopBrand(value) {
  return splitList(String(value || ""), SHOP_BRANDS)[0] || null;
}

/**
 * Filters live in the query string so refresh, Back, and shared links keep them. On
 * /shop/:brand the path brand applies until the visitor changes brands (then `brand` is written,
 * possibly empty, and wins).
 */
export function readShopFilters(searchParams, pathBrand) {
  const brands = searchParams.has("brand")
    ? splitList(searchParams.get("brand"), SHOP_BRANDS)
    : [normalizeShopBrand(pathBrand)].filter(Boolean);
  const sort = searchParams.get("sort");
  return {
    query: (searchParams.get("q") || "").trim(),
    brands,
    types: splitList(searchParams.get("type"), SHOP_TYPES),
    saleOnly: searchParams.get("sale") === "1",
    sort: SHOP_SORTS.some((s) => s.value === sort) ? sort : "default",
  };
}

export function writeShopFilters(filters, pathBrand) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  const pathDefault = [normalizeShopBrand(pathBrand)].filter(Boolean);
  const brandsMatchPath =
    filters.brands.length === pathDefault.length &&
    filters.brands.every((b) => pathDefault.includes(b));
  if (!brandsMatchPath) params.set("brand", filters.brands.join(LIST_SEPARATOR));
  if (filters.types.length) params.set("type", filters.types.join(LIST_SEPARATOR));
  if (filters.saleOnly) params.set("sale", "1");
  if (filters.sort !== "default") params.set("sort", filters.sort);
  return params;
}

export function hasActiveShopFilters(filters) {
  return Boolean(
    filters.query || filters.brands.length || filters.types.length || filters.saleOnly
  );
}

function bikeIsOnSale(bike) {
  const sale = Number(bike.saleprice);
  return Number.isFinite(sale) && sale > 0;
}

/** Price used for sorting (sale price when the card shows a sale). */
function effectiveSortPrice(bike) {
  const regular = Number(bike.price) || 0;
  const sale = Number(bike.saleprice);
  return Number.isFinite(sale) && sale > 0 && sale < regular ? sale : regular;
}

function searchWords(bike) {
  const material = bike.material && bike.material !== "N/A" ? bike.material : "";
  return `${bike.brand || ""} ${bike.name || ""} ${material}`
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

/** Every search word must start some word of the bike's brand, name, or material. */
function matchesQuery(bike, query) {
  if (!query) return true;
  const words = searchWords(bike);
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((q) => words.some((w) => w.startsWith(q)));
}

/**
 * Bikes passing every active filter. `ignore` skips one dimension ("brands" | "types" |
 * "saleOnly") so chip counts show what selecting that chip would give.
 */
export function filterShopBikes(bikes, filters, ignore = null) {
  return (bikes || []).filter((bike) => {
    const url = getBikeFirstImageUrl(bike);
    if (typeof url !== "string" || !url.trim()) return false;
    if (!matchesQuery(bike, filters.query)) return false;
    if (ignore !== "brands" && filters.brands.length && !filters.brands.includes(bike.brand)) {
      return false;
    }
    if (ignore !== "types" && filters.types.length && !filters.types.includes(bike.type)) {
      return false;
    }
    if (ignore !== "saleOnly" && filters.saleOnly && !bikeIsOnSale(bike)) return false;
    return true;
  });
}

export function sortShopBikes(bikes, sort) {
  const list = [...bikes];
  if (sort === "asc") list.sort((a, b) => effectiveSortPrice(a) - effectiveSortPrice(b));
  else if (sort === "desc") list.sort((a, b) => effectiveSortPrice(b) - effectiveSortPrice(a));
  else list.sort((a, b) => (Number(b.viewCount) || 0) - (Number(a.viewCount) || 0));
  return list;
}

/** How many bikes each brand / type / sale chip would show, given the other active filters. */
export function shopFilterCounts(bikes, filters) {
  const countBy = (list, key, values) =>
    Object.fromEntries(values.map((v) => [v, list.filter((b) => b[key] === v).length]));
  return {
    brands: countBy(filterShopBikes(bikes, filters, "brands"), "brand", SHOP_BRANDS),
    types: countBy(filterShopBikes(bikes, filters, "types"), "type", SHOP_TYPES),
    sale: filterShopBikes(bikes, filters, "saleOnly").filter(bikeIsOnSale).length,
  };
}
