function parseJsonArray(raw) {
  try {
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function parseJsonObject(raw) {
  try {
    const obj = JSON.parse(raw || "{}");
    return obj && typeof obj === "object" && !Array.isArray(obj) ? obj : {};
  } catch {
    return {};
  }
}

function isOutOfStock(availability) {
  return String(availability || "").trim().toLowerCase() === "out of stock";
}

/**
 * Admin to-do checks for one Transition bike. Archived bikes and drafts with nothing in stock are
 * not flagged. Returns [] when nothing needs attention.
 * @returns {{ key: string, label: string, severity: "high" | "medium" | "info" }[]}
 */
export function transitionBikeIssues(bike) {
  if (!bike || bike.archived) return [];

  const rows = [...parseJsonArray(bike.models), ...parseJsonArray(bike.inStock)];
  const sellableRows = rows.filter((r) => r && r.color != null && !isOutOfStock(r.availability));
  const isLive = Boolean(bike.public);

  if (!isLive && sellableRows.length === 0) return [];

  const issues = [];
  const photos = parseJsonObject(bike.colors);
  const colorsMissingPhoto = [
    ...new Set(
      sellableRows
        .map((r) => String(r.color).trim())
        .filter((color) => color && !String(photos[color] || "").trim())
    ),
  ];

  if (!isLive) {
    issues.push({
      key: "draft-with-stock",
      label: "Draft with stock, not on the site yet",
      severity: "medium",
    });
  }
  if (colorsMissingPhoto.length > 0) {
    issues.push({
      key: "missing-photo",
      label: `Missing photo: ${colorsMissingPhoto.join(", ")}`,
      severity: isLive ? "high" : "medium",
    });
  }
  if (!String(bike.description || "").trim()) {
    issues.push({ key: "no-description", label: "No description", severity: "medium" });
  }
  if (!String(bike.type || "").trim()) {
    issues.push({ key: "no-type", label: "No bike type", severity: "medium" });
  }
  if (isLive && rows.length > 0 && sellableRows.length === 0) {
    issues.push({
      key: "all-out-of-stock",
      label: "Every variant out of stock. Archive?",
      severity: "info",
    });
  }

  return issues;
}

const SEVERITY_RANK = { high: 0, medium: 1, info: 2 };

/** Bikes with issues, most urgent first (live before drafts, then by worst issue). */
export function transitionBikesNeedingAttention(bikes) {
  return (bikes || [])
    .map((bike) => ({ bike, issues: transitionBikeIssues(bike) }))
    .filter(({ issues }) => issues.length > 0)
    .sort((a, b) => {
      const worst = (list) => Math.min(...list.map((i) => SEVERITY_RANK[i.severity]));
      const d = worst(a.issues) - worst(b.issues);
      if (d !== 0) return d;
      const live = Number(Boolean(b.bike.public)) - Number(Boolean(a.bike.public));
      if (live !== 0) return live;
      return String(a.bike.fullName || "").localeCompare(String(b.bike.fullName || ""));
    });
}

export const OPEN_TRANSITION_BIKE_EVENT = "transition-admin-open-bike";
