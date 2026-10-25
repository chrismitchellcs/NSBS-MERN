/**
 * Lowercase string used for admin Transition/Norco list filtering.
 * @param {object} bike
 * @returns {string}
 */
export function buildBikeAdminSearchHay(bike) {
  return `${bike.name || ""} ${bike.fullName || ""} ${bike.brand || ""} ${bike.type || ""}`.toLowerCase();
}

/**
 * Loose match: every whitespace-separated token must appear somewhere in `hayLower`
 * (order-independent). E.g. "sight tq" matches "Sight VLT TQ".
 * @param {string} hayLower pre-lowercased haystack
 * @param {string} rawQuery user input
 */
/** Shown after year / retail on admin bike cards (Transition, Norco). */
export function adminCostListSuffix(costPrice) {
  if (costPrice == null || costPrice === "") return "";
  const n = Number(costPrice);
  if (!Number.isFinite(n)) return "";
  return ` · Cost $${n}`;
}

/** Table cell text for dashboard lists. */
export function adminCostCellText(costPrice) {
  if (costPrice == null || costPrice === "") return "—";
  const n = Number(costPrice);
  if (!Number.isFinite(n)) return "—";
  return `$${n}`;
}

export function looseAdminSearchMatches(hayLower, rawQuery) {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  return tokens.every((t) => hayLower.includes(t));
}
