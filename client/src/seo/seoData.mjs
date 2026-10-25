/**
 * Page titles, descriptions, and bike structured data. Plain ES module with no imports so the
 * React app and the Vercel functions in /api (crawler previews, sitemap) share one copy.
 */

export const SITE_URL = "https://www.northshorebikeshop.net";
export const SITE_NAME = "North Shore Bike Shop";
export const DEFAULT_SHARE_IMAGE = "/bikes-min.jpg";
export const SEO_BRANDS = ["Transition", "Norco", "Ibis"];

export const PAGE_META = {
  "/": {
    title: "North Shore Bike Shop | Transition Canada | Mountain Bikes & Service",
    description:
      "One of the largest Transition dealers in Canada. Transition, Norco and Ibis mountain bikes, plus expert service and repairs on Lonsdale in North Vancouver, BC.",
  },
  "/shop": {
    title: "Shop Mountain Bikes | Transition, Norco & Ibis | North Shore Bike Shop",
    description:
      "Browse Transition, Norco and Ibis mountain bikes in stock and available to order at North Shore Bike Shop in North Vancouver, BC.",
  },
  "/service": {
    title: "Bike Service & Repair | North Shore Bike Shop | North Vancouver",
    description:
      "Bike service and repair in North Vancouver. Tune-ups, brake bleeds, suspension service and more from mechanics who ride the Shore. First come, first served.",
    image: "/IMG_1090-min.jpg",
  },
  "/contact": {
    title: "Contact & Hours | North Shore Bike Shop | North Vancouver",
    description:
      "Hours, directions and contact details for North Shore Bike Shop at 1831 Lonsdale Avenue, North Vancouver. Call (604) 929-6727 or send us a message.",
  },
  "/return-policy": {
    title: "Return Policy | North Shore Bike Shop",
    description:
      "Return policy for North Shore Bike Shop. Unused parts, accessories, and clothing can be returned within 15 days. Bikes and helmets are final sale.",
  },
};

export const NOT_FOUND_META = {
  title: "Page not found | North Shore Bike Shop",
  description: "We couldn't find that page. Browse our bikes or get in touch with the shop.",
  noindex: true,
};

export const BIKE_NOT_FOUND_META = {
  title: "Bike not found | North Shore Bike Shop",
  description: "This bike is no longer listed. Browse our current bikes or get in touch with the shop.",
  noindex: true,
};

/** "transition" / "Transition" → "Transition"; unknown brands → null. */
export function seoBrand(value) {
  const v = String(value || "").trim().toLowerCase();
  return SEO_BRANDS.find((b) => b.toLowerCase() === v) || null;
}

export function brandPath(brand) {
  return `/shop/${String(brand || "").toLowerCase()}`;
}

/** Canonical bike address: always lowercase brand. */
export function bikePath(bike) {
  return `${brandPath(bike?.brand || "shop")}/${bike?._id}`;
}

export function pageMeta(path) {
  const meta = PAGE_META[path];
  return meta ? { ...meta, url: `${SITE_URL}${path === "/" ? "" : path}` } : null;
}

export function brandPageMeta(brand) {
  const name = seoBrand(brand);
  if (!name) return null;
  const url = `${SITE_URL}${brandPath(name)}`;
  if (name === "Transition") {
    return {
      title: "Transition Bikes Canada | Shop Transition at North Shore Bike Shop",
      description:
        "Shop Transition Bikes in Canada. North Shore Bike Shop is one of the largest Transition dealers in Canada. Sentinel, Spur, Smuggler, Patrol and more. North Vancouver, BC.",
      url,
    };
  }
  return {
    title: `${name} Bikes | Shop ${name} at North Shore Bike Shop`,
    description: `Shop ${name} mountain bikes at North Shore Bike Shop in North Vancouver, BC. See what's in stock and available to order.`,
    url,
  };
}

/** Model years stay out of search text: "26 Bottlerocket", "2025 Norco Fluid", "MY26". */
function stripYears(text) {
  return String(text || "")
    .replace(/\b(?:MY ?)?(?:19|20)\d{2}\b/gi, " ")
    .replace(/(^|\s)(?:MY ?|')\d{2}(?=\s)/gi, " ")
    .replace(/^\s*\d{2}\s+(?=[A-Za-z])/, "")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function truncate(text, max = 155) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:]+$/, "")}…`;
}

function parseJson(raw, fallback) {
  if (raw && typeof raw === "object") return raw;
  try {
    const v = JSON.parse(raw || "null");
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function priceOrNull(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Same rule as the shop: an active sale price wins, else the regular price. */
function effective(price, saleprice) {
  return priceOrNull(saleprice) ?? priceOrNull(price);
}

function formatPrice(n) {
  return Math.round(n).toLocaleString("en-CA");
}

const AVAILABILITY_RANK = [
  ["InStock", (a) => a === "in store" || a === "in stock" || a.startsWith("low stock")],
  ["PreOrder", (a) => a === "pre-order"],
  ["BackOrder", (a) => a === "available to order"],
  ["OutOfStock", (a) => a === "out of stock"],
];

function bikeAvailability(rows) {
  const seen = rows.map((r) => String(r?.availability || "").trim().toLowerCase().replace(/\s+/g, " "));
  const hit = AVAILABILITY_RANK.find(([, test]) => seen.some(test));
  return hit ? `https://schema.org/${hit[0]}` : null;
}

/** Display name without the model year, e.g. "Transition Bottlerocket Dual Crown". */
export function bikeSeoName(bike) {
  return [bike?.brand, stripYears(bike?.name)].filter(Boolean).join(" ");
}

export function bikeImages(bike) {
  const colors = parseJson(bike?.colors, {});
  return Object.values(colors && typeof colors === "object" ? colors : {}).filter(
    (u) => typeof u === "string" && /^https?:\/\//i.test(u)
  );
}

/** Title, description, share image, canonical URL, and Product structured data for a bike page. */
export function bikeSeo(bike) {
  const name = bikeSeoName(bike);
  const url = `${SITE_URL}${bikePath(bike)}`;
  const images = bikeImages(bike);
  const rows = [...parseJson(bike?.models, []), ...parseJson(bike?.inStock, [])].filter(
    (r) => r && typeof r === "object"
  );

  const basePrice = effective(bike?.price, bike?.saleprice);
  const variantPrices = rows
    .filter((r) => priceOrNull(r.price) != null)
    .map((r) => effective(r.price, r.saleprice));
  const prices = [basePrice, ...variantPrices].filter((n) => n != null);
  const low = prices.length ? Math.min(...prices) : null;
  const high = prices.length ? Math.max(...prices) : null;
  const priceLabel = low != null ? ` | ${high > low ? "From " : ""}$${formatPrice(low)}` : "";

  const typeText = bike?.type ? ` ${String(bike.type).toLowerCase()} bike` : " bike";
  const fallbackDescription = `${name}${typeText} available at North Shore Bike Shop in North Vancouver, BC. See sizes, colours and pricing.`;
  const description = truncate(stripYears(String(bike?.description || "").replace(/\s+/g, " ")) || fallbackDescription);

  const availability = bikeAvailability(rows);
  const seller = { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME };
  const offers =
    low == null
      ? undefined
      : high > low
        ? {
            "@type": "AggregateOffer",
            priceCurrency: "CAD",
            lowPrice: low.toFixed(2),
            highPrice: high.toFixed(2),
            offerCount: Math.max(rows.length, 1),
            ...(availability && { availability }),
            url,
            seller,
          }
        : {
            "@type": "Offer",
            priceCurrency: "CAD",
            price: low.toFixed(2),
            itemCondition: "https://schema.org/NewCondition",
            ...(availability && { availability }),
            url,
            seller,
          };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    ...(images.length && { image: images.slice(0, 6) }),
    ...(bike?.brand && { brand: { "@type": "Brand", name: bike.brand } }),
    ...(bike?.type && { category: bike.type }),
    ...(offers && { offers }),
  };

  return {
    title: `${name}${priceLabel} | ${SITE_NAME}`,
    description,
    url,
    image: images[0] || DEFAULT_SHARE_IMAGE,
    type: "product",
    jsonLd,
  };
}
