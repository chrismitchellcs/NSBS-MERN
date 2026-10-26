/** Stock wording shared by the bike page and checkout. */

export function normalizeAvailabilityKey(av) {
  if (av == null) return "";
  return String(av).trim().toLowerCase().replace(/\s+/g, " ");
}

export function isOutOfStock(av) {
  return normalizeAvailabilityKey(av) === "out of stock";
}

export function isInStore(av) {
  return normalizeAvailabilityKey(av) === "in store";
}

/** Shop stock reads "In store now"; anything the vendor can supply reads "Available to order". */
export function availabilityLabel(av) {
  const n = normalizeAvailabilityKey(av);
  if (!n) return "";
  if (n === "in store") return "In store now";
  if (n === "out of stock") return "Out of stock";
  if (n === "pre-order") return "Pre-order";
  return "Available to order";
}

/** Lower is better: in store, then orderable, then pre-order, then out of stock. */
export function availabilityRank(av) {
  const n = normalizeAvailabilityKey(av);
  if (n === "in store") return 0;
  if (n === "out of stock") return 3;
  if (n === "pre-order") return 2;
  return 1;
}
