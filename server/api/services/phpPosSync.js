const mongoose = require("mongoose");
const AllBikes = require("../models/AllBikes");
const {
  request,
  isConfigured,
  explainPhpPosSyncDisabled,
  getApiRoot,
} = require("./phpPosClient");

const PHP_POS_IMPORT_ERR_SAMPLE = 25;

function formatPhpPosImportError(e) {
  if (!e) return String(e);
  if (e.response) {
    const st = e.response.status;
    const data = e.response.data;
    const body =
      typeof data === "string" ? data : JSON.stringify(data ?? {});
    return `${e.message || "HTTP error"} [status ${st}] ${body.slice(0, 500)}`;
  }
  if (e.code === "ECONNABORTED") {
    return `${e.message || e} [timeout — increase PHP_POS_TIMEOUT_MS]`;
  }
  if (e.code) {
    return `${e.message || e} [${e.code}]`;
  }
  return e.message || String(e);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Pause between import-sync GETs (search, locations). Override PHP_POS_SYNC_DELAY_MS (0 to disable).
 * Defaults 800ms — POST /items often has a stricter quota; use PHP_POS_SYNC_WRITE_DELAY_MS for writes.
 */
function importSyncReadThrottleMs() {
  const raw = process.env.PHP_POS_SYNC_DELAY_MS;
  if (raw === "" || raw === undefined) return 800;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 800;
}

/**
 * Pause before each POST (create/update item). PHP POS returns 401 "time limit for this method" if too fast.
 * Override PHP_POS_SYNC_WRITE_DELAY_MS (0 to disable — not recommended).
 */
function importSyncWriteThrottleMs() {
  const raw = process.env.PHP_POS_SYNC_WRITE_DELAY_MS;
  if (raw === "" || raw === undefined) return 3500;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 3500;
}

async function throttleImportReadRequest() {
  const ms = importSyncReadThrottleMs();
  if (ms > 0) await sleep(ms);
}

async function throttleImportWriteRequest() {
  const ms = importSyncWriteThrottleMs();
  if (ms > 0) await sleep(ms);
}

/** Log each SKU to the console during import-sync (default on). Set PHP_POS_SYNC_LOG_EACH=false to quiet. */
function phpPosSyncLogEachSku() {
  const raw = process.env.PHP_POS_SYNC_LOG_EACH;
  if (raw === undefined || raw === "") return true;
  const s = String(raw).trim().toLowerCase();
  if (s === "0" || s === "false" || s === "no" || s === "off") return false;
  return true;
}

function posResponseErrorText(res) {
  const d = res && res.data;
  if (d == null) return "";
  if (typeof d === "string") return d;
  if (typeof d.error === "string") return d.error;
  try {
    return JSON.stringify(d);
  } catch {
    return String(d);
  }
}

function shouldRetryPhpPosWriteResponse(res, attempt) {
  if (res.status === 429) return true;
  if (res.status === 401) {
    const t = posResponseErrorText(res).toLowerCase();
    return /time limit|rate|throttl|too many|quota/.test(t);
  }
  if (res.status === 503 || res.status === 502) return true;
  return false;
}

function isPhpPosMethodTimeLimitResponse(res) {
  const t = posResponseErrorText(res).toLowerCase();
  return /time limit for this method/.test(t);
}

const PHP_POS_WRITE_MAX_ATTEMPTS = 8;
const PHP_POS_WRITE_BASE_BACKOFF_MS = 2500;

function computePhpPosWriteBackoffMs(res, attempt) {
  if (isPhpPosMethodTimeLimitResponse(res)) {
    return Math.min(180_000, 35_000 * attempt);
  }
  return Math.min(
    60_000,
    PHP_POS_WRITE_BASE_BACKOFF_MS * Math.pow(2, attempt - 1)
  );
}

/**
 * POST with delay between attempts + backoff when POS returns rate / transient errors.
 */
async function requestPostWithImportRetries(method, path, payload, logCtx) {
  let lastRes = null;
  for (let attempt = 1; attempt <= PHP_POS_WRITE_MAX_ATTEMPTS; attempt++) {
    await throttleImportWriteRequest();
    lastRes = await request(method, path, payload);
    if (lastRes.status < 400) return lastRes;
    const retry = shouldRetryPhpPosWriteResponse(lastRes, attempt);
    if (!retry || attempt >= PHP_POS_WRITE_MAX_ATTEMPTS) return lastRes;
    const backoff = computePhpPosWriteBackoffMs(lastRes, attempt);
    const hint = posResponseErrorText(lastRes).slice(0, 160);
    console.warn(
      `[PHP POS] ${logCtx} — HTTP ${lastRes.status}, waiting ${backoff}ms before retry ${attempt + 1}/${PHP_POS_WRITE_MAX_ATTEMPTS}${hint ? ` (${hint})` : ""}`
    );
    await sleep(backoff);
  }
  return lastRes;
}

function parseModelsJson(modelsJson) {
  try {
    const arr = JSON.parse(modelsJson || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function asArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.locations)) return data.locations;
  return [];
}

/** Regular retail / list (Mongo `price`). Stored on POS as custom_fields.ListPrice when on sale. */
function listUnitPriceFromBike(bike) {
  const p = Number(bike && bike.price);
  return Number.isFinite(p) && p >= 0 ? p : 0;
}

/** Sale amount when active (Mongo `saleprice` > 0), else null. Detects on-sale; not written as POS promo_price. */
function promoPriceFromBike(bike) {
  if (!bike || bike.saleprice == null || bike.saleprice === "") return null;
  const sale = Number(bike.saleprice);
  return Number.isFinite(sale) && sale > 0 ? sale : null;
}

/** What staff/customers pay (sale if set, else list). Used for POS unit_price and suspended-sale cart lines. */
function effectiveSellPriceFromBike(bike) {
  const promo = promoPriceFromBike(bike);
  if (promo != null) return promo;
  return listUnitPriceFromBike(bike);
}

/** PHP POS returns HTTP 405 for invalid item payloads (OpenAPI: "Invalid input"), not method mismatch. */
function requirePositiveUnitPriceForPhpPos(bike, row, verb) {
  const pn = String(row.partNumber || "").trim();
  const unitPrice = effectiveSellPriceFromBike(bike);
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
    throw new Error(
      `PHP POS ${verb}: unit_price must be > 0 (got ${unitPrice}) for item_number=${pn}. Set bike price in Mongo — addItem/updateItem often respond with HTTP 405 when the payload is invalid.`
    );
  }
}

function transitionAvailabilityToOpeningQty(availability) {
  const s = String(availability || "").trim().toLowerCase();
  if (!s || s === "\u2014") return 0;
  if (s === "out of stock" || s === "out of stock.") return 0;
  const low = s.match(/low\s*stock\s*\((\d+)\)/i);
  if (low) return Math.max(0, parseInt(low[1], 10) || 0);
  if (s.includes("in stock")) return 10;
  if (s.includes("pre-order") || s.includes("preorder")) return 0;
  if (s.includes("available to order")) return 0;
  return 0;
}

function availabilityFromPosQuantity(qty) {
  const q = Number(qty);
  if (!Number.isFinite(q) || q <= 0) return "Out of Stock";
  const n = Math.min(5, Math.max(1, Math.floor(q)));
  if (q <= 5) return `Low Stock (${n})`;
  return "In Stock";
}

function sumLocationQuantities(item) {
  const loc = item && item.locations;
  if (!loc || typeof loc !== "object") return 0;
  let sum = 0;
  for (const v of Object.values(loc)) {
    if (v == null) continue;
    const q = Number(v.quantity);
    if (Number.isFinite(q)) sum += q;
  }
  return sum;
}

function normalizeVariantKey(s) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/** Matches storefront logic: only hard "out of stock" blocks a sale from Mongo alone. */
function mongoRowSellable(availability) {
  const n = normalizeVariantKey(availability);
  return n !== "out of stock";
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

async function resolvePhpPosItemForRow(row) {
  if (!row) return null;
  if (row.phpPosItemId != null && Number(row.phpPosItemId) > 0) {
    const item = await getItemById(Number(row.phpPosItemId));
    if (item) return item;
  }
  if (row.partNumber != null && String(row.partNumber).trim()) {
    const found = await searchItemByItemNumber(row.partNumber);
    if (found && found.item_id != null) {
      return getItemById(Number(found.item_id));
    }
  }
  return null;
}

/**
 * Classify inquiry fulfillment. Never blocks for OOS — only invalid bike/variant.
 */
async function classifyInquiryFulfillment({ bikeId, color, size }) {
  const id = bikeId != null ? String(bikeId).trim() : "";
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, code: 400, message: "Invalid bike id" };
  }

  const bike = await AllBikes.findById(id).lean();
  if (!bike) {
    return { ok: false, code: 404, message: "Bike not found" };
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
  let posQty = null;
  let phpPosItemId =
    row.phpPosItemId != null && Number(row.phpPosItemId) > 0
      ? Number(row.phpPosItemId)
      : null;

  if (isConfigured()) {
    try {
      const item = await resolvePhpPosItemForRow(row);
      if (item) {
        phpPosItemId =
          item.item_id != null ? Number(item.item_id) : phpPosItemId;
        const loc = item.locations;
        if (loc && typeof loc === "object" && Object.keys(loc).length > 0) {
          posQty = sumLocationQuantities(item);
        } else {
          posQty = 0;
        }
      }
    } catch (e) {
      console.error("[PHP POS] classifyInquiryFulfillment item lookup:", e);
    }
  }

  if (posQty != null && posQty >= 1) {
    return {
      ok: true,
      fulfillment: "from_stock",
      payable: true,
      posQty,
      vendorAvailability,
      bike,
      row,
      phpPosItemId,
    };
  }

  const isTransition =
    String(bike.database || "").toUpperCase() === "TRANSITION";
  if (isTransition && vendorAllowsSpecialOrder(vendorAvailability)) {
    return {
      ok: true,
      fulfillment: "special_order",
      payable: true,
      posQty: posQty == null ? 0 : posQty,
      vendorAvailability,
      bike,
      row,
      phpPosItemId,
    };
  }

  return {
    ok: true,
    fulfillment: "inquiry_only",
    payable: false,
    posQty: posQty == null ? 0 : posQty,
    vendorAvailability,
    bike,
    row,
    phpPosItemId,
  };
}

/**
 * @param {{ forPayment?: boolean }} opts — when forPayment, refuse inquiry_only / non-payable.
 */
async function validateCheckoutStock({
  bikeId,
  color,
  size,
  quantity = 1,
  forPayment = false,
}) {
  const need = Math.max(1, Math.floor(Number(quantity)) || 1);
  const classified = await classifyInquiryFulfillment({ bikeId, color, size });
  if (!classified.ok) {
    return {
      ok: false,
      code: classified.code,
      message: classified.message,
    };
  }

  if (forPayment && !classified.payable) {
    return {
      ok: false,
      code: 409,
      message:
        "This configuration is not available for online payment right now. Please send an inquiry and we will follow up.",
      source: "payable_gate",
      posQty: classified.posQty,
      payable: false,
      fulfillment: classified.fulfillment,
    };
  }

  if (!forPayment) {
    return {
      ok: true,
      source: classified.fulfillment,
      posQty: classified.posQty,
      payable: classified.payable,
      fulfillment: classified.fulfillment,
    };
  }

  if (
    classified.fulfillment === "from_stock" &&
    classified.posQty != null &&
    classified.posQty < need
  ) {
    return {
      ok: false,
      code: 409,
      message:
        "Not enough stock for this bike right now. Please choose another option or contact the shop.",
      source: "pos",
      posQty: classified.posQty,
      payable: false,
      fulfillment: classified.fulfillment,
    };
  }

  return {
    ok: true,
    source: classified.fulfillment,
    posQty: classified.posQty,
    payable: classified.payable,
    fulfillment: classified.fulfillment,
  };
}

function truncate(str, max) {
  const t = String(str || "").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + "\u2026";
}

let cachedDefaultLocationId = null;

async function resolveDefaultLocationId() {
  if (process.env.PHP_POS_LOCATION_ID) {
    return String(process.env.PHP_POS_LOCATION_ID).trim();
  }
  if (cachedDefaultLocationId) return cachedDefaultLocationId;
  await throttleImportReadRequest();
  const res = await request("get", "/locations?limit=10");
  if (res.status >= 400) return null;
  const list = asArray(res.data);
  const first = list.find((l) => l && l.location_id != null);
  if (first) {
    cachedDefaultLocationId = String(first.location_id);
    return cachedDefaultLocationId;
  }
  return null;
}

function itemNumbersEqual(a, b) {
  return (
    String(a || "")
      .trim()
      .toLowerCase() ===
    String(b || "")
      .trim()
      .toLowerCase()
  );
}

function findExactItemNumberInList(items, want) {
  return (
    (items || []).find(
      (it) => it && itemNumbersEqual(it.item_number, want)
    ) || null
  );
}

async function fetchItemsSearch(params) {
  const q = new URLSearchParams(params);
  await throttleImportReadRequest();
  const res = await request("get", `/items?${q.toString()}`);
  if (res.status >= 400) {
    throw new Error(
      `PHP POS item search failed: ${res.status} ${JSON.stringify(res.data)}`
    );
  }
  return asArray(res.data);
}

/**
 * Find an item by exact item_number. Keep this to a few GETs — deep pagination
 * with PHP_POS_SYNC_DELAY_MS makes bulk sync appear hung.
 */
async function searchItemByItemNumber(itemNumber, options = {}) {
  const want = String(itemNumber || "").trim();
  if (!want) return null;

  const trySearch = async (params) => {
    const items = await fetchItemsSearch(params);
    return findExactItemNumberInList(items, want);
  };

  let hit = await trySearch({
    search_field: "item_number",
    search: want,
    limit: "50",
  });
  if (hit) return hit;

  // One bounded prefix page (dotted Transition SKUs often miss on exact match).
  const parts = want.split(".");
  if (parts.length > 1) {
    const prefix = parts.slice(0, -1).join(".");
    hit = await trySearch({
      search_field: "item_number",
      search: prefix,
      limit: "100",
    });
    if (hit) return hit;
  }

  hit = await trySearch({ search: want, limit: "50" });
  if (hit) return hit;

  const nameHint = options.nameHint && String(options.nameHint).trim();
  if (nameHint) {
    hit = await trySearch({ search: nameHint, limit: "50" });
    if (hit) return hit;
  }

  return null;
}

async function getItemById(itemId) {
  const res = await request("get", `/items/${itemId}`);
  if (res.status >= 400) return null;
  if (res.data && res.data.item_id != null) {
    notePhpPosItemIdSeen(res.data.item_id);
  }
  return res.data;
}

/** Highest item_id observed this process — used to probe orphan duplicates. */
let highestPhpPosItemIdSeen = 0;

/** item_number (lower) -> item snapshot; built once per bulk import for duplicate recovery. */
let phpPosItemNumberIndex = null;
let phpPosItemNumberIndexBuilding = null;

function notePhpPosItemIdSeen(id) {
  const n = Number(id);
  if (Number.isFinite(n) && n > highestPhpPosItemIdSeen) {
    highestPhpPosItemIdSeen = n;
  }
}

function resetPhpPosItemNumberIndex() {
  phpPosItemNumberIndex = null;
  phpPosItemNumberIndexBuilding = null;
}

/**
 * One shared scan of recent item ids so duplicate recovery does not re-probe
 * hundreds of ids (silently) for every 405 SKU.
 */
async function ensurePhpPosItemNumberIndex() {
  if (phpPosItemNumberIndex) return phpPosItemNumberIndex;
  if (phpPosItemNumberIndexBuilding) return phpPosItemNumberIndexBuilding;

  phpPosItemNumberIndexBuilding = (async () => {
    const map = new Map();
    const envStart = Number(process.env.PHP_POS_ITEM_ID_PROBE_START) || 0;
    let start = Math.max(highestPhpPosItemIdSeen, envStart);
    if (start < 1) start = 300;
    const maxProbes = Math.min(
      400,
      Math.max(40, Number(process.env.PHP_POS_ITEM_ID_PROBE_WINDOW) || 200)
    );
    const minId = Math.max(1, start - maxProbes + 1);
    console.log(
      `[PHP POS] building item_number index (ids ${start}→${minId}) for duplicate recovery…`
    );
    let consecutiveEmpty = 0;
    let scanned = 0;
    for (let id = start; id >= minId; id--) {
      scanned += 1;
      const item = await getItemById(id);
      if (!item) {
        consecutiveEmpty += 1;
        // Burst of misses often means rate-limit / auth — stop rather than hang.
        if (consecutiveEmpty >= 15) {
          console.warn(
            `[PHP POS] item index abort after ${consecutiveEmpty} empty GETs near id=${id} (rate limit?). Indexed ${map.size} item(s) from ${scanned} scan(s).`
          );
          break;
        }
        await sleep(30);
        continue;
      }
      consecutiveEmpty = 0;
      notePhpPosItemIdSeen(id);
      const pn = String(item.item_number || "")
        .trim()
        .toLowerCase();
      if (pn) map.set(pn, item);
      if (scanned === 1 || scanned % 25 === 0) {
        console.log(
          `[PHP POS] item index progress id=${id} scanned=${scanned} mapped=${map.size}`
        );
      }
      await sleep(30);
    }
    phpPosItemNumberIndex = map;
    console.log(
      `[PHP POS] item_number index ready — ${map.size} item_number(s) mapped`
    );
    return map;
  })();

  try {
    return await phpPosItemNumberIndexBuilding;
  } finally {
    phpPosItemNumberIndexBuilding = null;
  }
}

/**
 * When search fails but create returns duplicate 405, resolve via shared index.
 */
async function findItemByProbingRecentIds(itemNumber) {
  const want = String(itemNumber || "").trim();
  if (!want) return null;
  console.log(
    `[PHP POS] duplicate recovery lookup for item_number=${want}…`
  );
  const map = await ensurePhpPosItemNumberIndex();
  const hit = map.get(want.toLowerCase());
  return hit || null;
}

async function resolveExistingPhpPosItem(itemNumber, nameHint, options = {}) {
  let found = await searchItemByItemNumber(itemNumber, { nameHint });
  if (found) {
    notePhpPosItemIdSeen(found.item_id);
    return found;
  }
  // ID probe is only for duplicate-create recovery — never on the cold path.
  if (!options.probe) return null;
  found = await findItemByProbingRecentIds(itemNumber);
  if (found) {
    console.warn(
      `[PHP POS] found item_number=${itemNumber} via recent id probe item_id=${found.item_id}`
    );
    notePhpPosItemIdSeen(found.item_id);
  }
  return found;
}

function isLikelyDuplicateItemCreateResponse(res) {
  if (!res || res.status !== 405) return false;
  const ct = String(
    (res.headers &&
      (res.headers["content-type"] || res.headers["Content-Type"])) ||
      ""
  ).toLowerCase();
  const body = res.data;
  const emptyBody =
    body == null ||
    body === "" ||
    (typeof body === "string" && body.trim() === "") ||
    (typeof body === "object" && Object.keys(body).length === 0);
  // Duplicate item_number on this tenant returns HTML 405 with an empty body.
  return emptyBody || ct.includes("text/html");
}

async function persistBikeModels(bike, rows) {
  if (!bike || bike._id == null) return;
  await AllBikes.updateOne(
    { _id: bike._id },
    { $set: { models: JSON.stringify(rows) } }
  );
}

function moneyEqual(a, b) {
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isFinite(na) || !Number.isFinite(nb)) return false;
  return Math.abs(na - nb) < 0.005;
}

/** True when POS item already matches name / sell price / cost (and promo cleared). */
function phpPosItemMatchesExpected(item, bike, row) {
  if (!item) return false;
  const { body } = buildItemCoreBody(bike, row);
  if (String(item.name || "").trim() !== String(body.name || "").trim()) {
    return false;
  }
  if (!moneyEqual(item.unit_price, body.unit_price)) return false;
  const promo = item.promo_price;
  if (promo != null && promo !== "" && Number(promo) > 0) return false;
  if (body.cost_price != null) {
    if (!moneyEqual(item.cost_price, body.cost_price)) return false;
  }
  return true;
}

/** Demo: single “Bike” category is often id `0`; override for live POS via `PHP_POS_ITEM_CATEGORY_ID`. */
function resolvedBikeCategoryId() {
  const n = Number.parseInt(String(process.env.PHP_POS_ITEM_CATEGORY_ID ?? "0"), 10);
  return Number.isFinite(n) ? n : 0;
}

/** One cost per bike doc (same as retail). Legacy rows may still have `costPrice` on each variant. */
function modelCostForPos(bike, row) {
  const fromBike = bike && bike.costPrice;
  if (fromBike != null && fromBike !== "") {
    const n = Number(fromBike);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  const fromRow = row && row.costPrice;
  if (fromRow != null && fromRow !== "") {
    const n = Number(fromRow);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return null;
}

/**
 * OpenAPI: POST /items and POST /items/{id} use 405 for validation failures
 * ("Invalid input" / "Validation exception"), not HTTP method mismatch.
 * @see https://phppointofsale.com/api.php#/items/addItem
 */
function logPhpPosItemWriteFailure(operation, res, itemNumber) {
  const status = res.status;
  const resData = res.data;
  const snippet = JSON.stringify(resData ?? "").slice(0, 900);
  const ct =
    (res.headers &&
      (res.headers["content-type"] || res.headers["Content-Type"])) ||
    "";
  const base = `[PHP POS] ${operation} failed HTTP ${status} item_number=${itemNumber}`;
  if (status === 405) {
    const root = getApiRoot();
    console.error(
      `${base} — PHP POS uses 405 for invalid payloads on item writes (not "wrong HTTP method"). endpoint=${root ? `${root}/items` : "?"}. If every item fails, verify PHP_BASE_URL is the store root only (not …/index.php/api/v1 twice), set PHP_POS_ITEM_CATEGORY_ID to a real category, and try PHP_POS_ITEM_IS_SERIALIZED=false if serialized items are blocked. content-type=${ct || "?"} body=${snippet || "(empty)"}`
    );
  } else {
    console.error(
      `${base} content-type=${ct || "?"} body=${snippet || "(empty)"}`
    );
  }
}

function buildWebsiteSourceTags(bike) {
  const db = String(bike && bike.database ? bike.database : "")
    .trim()
    .toUpperCase();
  const tags = ["NSBS_WEB"];
  if (db) tags.push(`${db}_WEB`);
  return tags.join(",");
}

function resolveEditableDescription(bike, row, itemNumber) {
  const rowDescriptionCandidates = [
    row && row.description,
    row && row.phpPosDescription,
    row && row.posDescription,
  ];
  for (const candidate of rowDescriptionCandidates) {
    if (candidate != null && String(candidate).trim() !== "") {
      return truncate(String(candidate).trim(), 500);
    }
  }
  if (bike && bike.description != null && String(bike.description).trim() !== "") {
    return truncate(String(bike.description).trim(), 500);
  }
  return truncate(
    [bike.fullName, bike.database, itemNumber].filter(Boolean).join(" \u00b7 "),
    500
  );
}

function buildItemCoreBody(bike, row) {
  const brand = bike.brand || "";
  const name = bike.name || "";
  const size = row.size != null ? String(row.size).trim() : "";
  const color = row.color != null ? String(row.color).trim() : "";
  const itemNumber = String(row.partNumber || "").trim();
  // No `color` on the items API — keep size in `size` and put colour in `name`.
  const variantLabel = [size, color].filter(Boolean).join(" / ");
  const baseName = `${brand} ${name}`.trim();
  const title = truncate(
    variantLabel ? `${baseName} (${variantLabel})` : baseName,
    240
  );
  const unitPrice = effectiveSellPriceFromBike(bike);
  const listPrice = listUnitPriceFromBike(bike);
  const onSale = promoPriceFromBike(bike) != null;
  const body = {
    name: title || itemNumber,
    item_number: itemNumber,
    unit_price: unitPrice,
    // Clear promo so browse and register show the same price (unit_price = sell).
    promo_price: null,
    category_id: resolvedBikeCategoryId(),
  };
  if (onSale && listPrice > 0) {
    body.custom_fields = { ListPrice: listPrice };
  }
  if (size) body.size = size;
  const cost = modelCostForPos(bike, row);
  if (cost != null) {
    body.cost_price = cost;
    body.change_cost_price = true;
  }
  return { body, itemNumber };
}

function buildCreateItemBody(bike, row) {
  const { body, itemNumber } = buildItemCoreBody(bike, row);
  const tags = buildWebsiteSourceTags(bike);
  return {
    body: {
      ...body,
      description: resolveEditableDescription(bike, row, itemNumber),
      is_serialized: true,
      allow_alt_description: false,
      ...(tags ? { tags } : {}),
    },
    itemNumber,
  };
}

function buildUpdateItemBody(bike, row) {
  const { body, itemNumber } = buildItemCoreBody(bike, row);
  const tags = buildWebsiteSourceTags(bike);
  return {
    body: {
      ...body,
      description: resolveEditableDescription(bike, row, itemNumber),
      is_serialized: true,
      allow_alt_description: false,
      ...(tags ? { tags } : {}),
    },
    itemNumber,
  };
}

async function attachLocationsIfPossible(body, openingQty) {
  if (openingQty <= 0) return body;
  const locId = await resolveDefaultLocationId();
  if (!locId) return body;
  return {
    ...body,
    locations: {
      [locId]: { quantity: openingQty },
    },
  };
}

async function createPhpPosItem(bike, row) {
  requirePositiveUnitPriceForPhpPos(bike, row, "create item");
  const openingQty =
    bike.database === "TRANSITION"
      ? transitionAvailabilityToOpeningQty(row.availability)
      : 0;
  const { body } = buildCreateItemBody(bike, row);
  let payload = await attachLocationsIfPossible(body, openingQty);
  const pn = String(row.partNumber || "").trim();
  let res = await requestPostWithImportRetries(
    "post",
    "/items",
    payload,
    `POST /items item_number=${pn}`
  );
  if (res.status === 405 && payload.locations) {
    const withoutLoc = { ...payload };
    delete withoutLoc.locations;
    console.warn(
      `[PHP POS] POST /items returned 405 with locations — retrying without locations for item_number=${pn}`
    );
    payload = withoutLoc;
    res = await requestPostWithImportRetries(
      "post",
      "/items",
      payload,
      `POST /items (no locations) item_number=${pn}`
    );
  }
  if (res.status >= 400) {
    if (isLikelyDuplicateItemCreateResponse(res)) {
      const found = await resolveExistingPhpPosItem(pn, payload.name, {
        probe: true,
      });
      if (found && found.item_id != null) {
        console.warn(
          `[PHP POS] create 405 for item_number=${pn} — treated as duplicate, linked item_id=${found.item_id}`
        );
        notePhpPosItemIdSeen(found.item_id);
        return { itemId: Number(found.item_id), recoveredDuplicate: true };
      }
    }
    logPhpPosItemWriteFailure("POST /items", res, pn);
    throw new Error(
      `PHP POS create item failed: ${res.status} ${JSON.stringify(res.data)}`
    );
  }
  const data = res.data;
  const itemId = data && (data.item_id ?? data.id);
  if (itemId == null) {
    throw new Error(
      `PHP POS create item: missing item_id in ${JSON.stringify(data)}`
    );
  }
  notePhpPosItemIdSeen(itemId);
  return { itemId: Number(itemId), recoveredDuplicate: false };
}

function phpPosItemMissingError(itemId) {
  const err = new Error(
    `PHP POS item ${itemId} is missing (deleted or invalid)`
  );
  err.code = "PHP_POS_ITEM_MISSING";
  err.itemId = itemId;
  return err;
}

async function updatePhpPosItem(itemId, bike, row, options = {}) {
  requirePositiveUnitPriceForPhpPos(bike, row, "update item");
  const pn = String(row.partNumber || "").trim();
  if (!options.force) {
    await throttleImportReadRequest();
    const existing = await getItemById(itemId);
    if (!existing) {
      throw phpPosItemMissingError(itemId);
    }
    if (phpPosItemMatchesExpected(existing, bike, row)) {
      return { skipped: true };
    }
  }
  const { body } = buildUpdateItemBody(bike, row);
  const phase = options.phase ? ` (${options.phase})` : "";
  const res = await requestPostWithImportRetries(
    "post",
    `/items/${itemId}`,
    body,
    `POST /items/${itemId}${phase} item_number=${pn}`
  );
  if (res.status === 404) {
    throw phpPosItemMissingError(itemId);
  }
  if (res.status >= 400) {
    logPhpPosItemWriteFailure(`POST /items/${itemId}`, res, pn);
    throw new Error(
      `PHP POS update item ${itemId} failed: ${res.status} ${JSON.stringify(
        res.data
      )}`
    );
  }
  return { skipped: false };
}

async function syncBikeToPhpPos(bike) {
  const errors = [];
  if (!isConfigured() || !bike) {
    return { errors, modelsUpdated: false };
  }
  const db = bike.database;
  if (!["TRANSITION", "NORCO", "OTHER"].includes(db)) {
    return { errors, modelsUpdated: false };
  }

  const rows = parseModelsJson(bike.models);
  if (rows.length === 0) {
    return { errors, modelsUpdated: false };
  }

  let changed = false;

  async function linkAndPersist(index, row, itemId) {
    rows[index] = { ...row, phpPosItemId: itemId };
    changed = true;
    await persistBikeModels(bike, rows);
  }

  async function clearLinkAndPersist(index, row) {
    const next = { ...row };
    delete next.phpPosItemId;
    rows[index] = next;
    changed = true;
    await persistBikeModels(bike, rows);
  }

  async function updateAndLog(itemId, row, pn, label, logEach) {
    const upd = await updatePhpPosItem(itemId, bike, row);
    if (logEach) {
      console.log(
        upd && upd.skipped
          ? `[PHP POS import-sync] skipped no-op update item_number=${pn} item_id=${itemId} — ${label}`
          : `[PHP POS import-sync] updated item_number=${pn} item_id=${itemId} — ${label}`
      );
    }
    return upd;
  }

  async function resolveUnlinkedSku(index, row, pn, label, logEach) {
    const { body: expected } = buildItemCoreBody(bike, row);
    const existing = await resolveExistingPhpPosItem(row.partNumber, expected.name);
    if (existing && existing.item_id != null) {
      const itemId = Number(existing.item_id);
      if (logEach) {
        console.log(
          `[PHP POS import-sync] linked existing item_number=${pn} item_id=${itemId} — ${label}`
        );
      }
      await linkAndPersist(index, row, itemId);
      await updateAndLog(itemId, rows[index], pn, label, logEach);
      return;
    }

    const created = await createPhpPosItem(bike, row);
    const itemId = created.itemId;
    if (created.recoveredDuplicate) {
      if (logEach) {
        console.log(
          `[PHP POS import-sync] recovered duplicate item_number=${pn} item_id=${itemId} — ${label}`
        );
      }
      await linkAndPersist(index, row, itemId);
      await updateAndLog(itemId, rows[index], pn, label, logEach);
      return;
    }

    if (logEach) {
      console.log(
        `[PHP POS import-sync] created item_number=${pn} item_id=${itemId} — ${label}`
      );
    }
    await linkAndPersist(index, row, itemId);
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.partNumber == null || !String(row.partNumber).trim()) {
      continue;
    }
    try {
      let itemId = row.phpPosItemId != null ? Number(row.phpPosItemId) : NaN;
      const pn = String(row.partNumber || "").trim();
      const label = bike.fullName || String(bike._id || "");
      const logEach = phpPosSyncLogEachSku();
      if (logEach) {
        console.log(
          `[PHP POS import-sync] syncing item_number=${pn} — ${label}`
        );
      }

      if (Number.isFinite(itemId) && itemId > 0) {
        try {
          await updateAndLog(itemId, row, pn, label, logEach);
          continue;
        } catch (e) {
          if (e && e.code === "PHP_POS_ITEM_MISSING") {
            console.warn(
              `[PHP POS import-sync] stale phpPosItemId=${itemId} for item_number=${pn} — clearing and re-resolving — ${label}`
            );
            await clearLinkAndPersist(i, row);
            await resolveUnlinkedSku(i, rows[i], pn, label, logEach);
            continue;
          }
          throw e;
        }
      }

      await resolveUnlinkedSku(i, row, pn, label, logEach);
    } catch (e) {
      const msg = formatPhpPosImportError(e);
      const line = `${bike.fullName || bike._id} / ${row.partNumber}: ${msg}`;
      errors.push(line);
      console.error(`[PHP POS import-sync] ${line}`);
    }
  }

  return { errors, modelsUpdated: changed };
}

async function syncPhpPosForImportedFullNames(fullNames, database) {
  const label = `[PHP POS import-sync] ${database}`;
  if (!fullNames || fullNames.length === 0) {
    console.warn(`${label} skipped: no model names in request.`);
    return { skipped: true, skipReason: "empty fullNames", errors: [] };
  }
  if (!isConfigured()) {
    const why = explainPhpPosSyncDisabled() || "unknown";
    console.warn(`${label} skipped: ${why}`);
    return { skipped: true, skipReason: why, errors: [] };
  }

  const unique = [...new Set(fullNames.map((f) => String(f).trim()))];
  const readMs = importSyncReadThrottleMs();
  const writeMs = importSyncWriteThrottleMs();
  console.log(
    `${label} starting — ${unique.length} unique model name(s). Delays: GET ${readMs}ms (PHP_POS_SYNC_DELAY_MS), POST ${writeMs}ms (PHP_POS_SYNC_WRITE_DELAY_MS). Sync runs in the background; wait for DONE.`
  );

  // Fresh index each bulk run (POS may have been wiped / items renamed).
  resetPhpPosItemNumberIndex();

  const docs = await AllBikes.find({
    fullName: { $in: unique },
    database,
  }).lean();

  if (docs.length < unique.length) {
    const got = new Set(docs.map((d) => d.fullName));
    const missing = unique.filter((n) => !got.has(n));
    console.warn(
      `${label} only ${docs.length}/${unique.length} Mongo doc(s) found. Missing sample:`,
      missing.slice(0, 8)
    );
  } else {
    console.log(`${label} loaded ${docs.length} Mongo document(s).`);
  }

  const allErrors = [];
  let i = 0;
  for (const doc of docs) {
    i += 1;
    const { errors } = await syncBikeToPhpPos(doc);
    allErrors.push(...errors);
    if (i === 1 || i === docs.length || i % 10 === 0) {
      console.log(`${label} progress ${i}/${docs.length} bike doc(s), ${allErrors.length} error(s) so far`);
    }
  }

  const errN = allErrors.length;
  if (errN > 0) {
    console.error(
      `${label} DONE with ${errN} error(s). First ${Math.min(PHP_POS_IMPORT_ERR_SAMPLE, errN)}:`
    );
    allErrors.slice(0, PHP_POS_IMPORT_ERR_SAMPLE).forEach((ln) => console.error(`  ${ln}`));
    if (errN > PHP_POS_IMPORT_ERR_SAMPLE) {
      console.error(`  … and ${errN - PHP_POS_IMPORT_ERR_SAMPLE} more (grep logs for "[PHP POS import-sync]")`);
    }
  } else {
    console.log(`${label} DONE — ${docs.length} bike doc(s), 0 variant error(s).`);
  }

  return {
    skipped: false,
    bikesProcessed: docs.length,
    errors: allErrors,
  };
}

async function pullStockFromPhpPosOnce() {
  if (!isConfigured()) return { skipped: true };

  const dbs = ["TRANSITION", "NORCO", "OTHER"];
  let bikesTouched = 0;
  const errors = [];

  for (const database of dbs) {
    const cursor = AllBikes.find({ database })
      .select("models fullName database")
      .cursor();

    for await (const bike of cursor) {
      const rows = parseModelsJson(bike.models);
      let changed = false;
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const id = row && row.phpPosItemId;
        if (id == null) continue;
        try {
          const item = await getItemById(id);
          if (!item) continue;
          const loc = item.locations;
          if (
            !loc ||
            typeof loc !== "object" ||
            Object.keys(loc).length === 0
          ) {
            continue;
          }
          const qty = sumLocationQuantities(item);
          // Never overwrite Transition B2B scraped `availability` — used for special-order gating.
          if (database === "TRANSITION") {
            if (Number(row.phpPosQty) !== qty) {
              rows[i] = { ...row, phpPosQty: qty };
              changed = true;
            }
          } else {
            const nextAv = availabilityFromPosQuantity(qty);
            if (
              String(row.availability || "").trim() !== nextAv ||
              Number(row.phpPosQty) !== qty
            ) {
              rows[i] = { ...row, availability: nextAv, phpPosQty: qty };
              changed = true;
            }
          }
        } catch (e) {
          errors.push(
            `${bike.fullName} item ${id}: ${e.message || String(e)}`
          );
        }
      }
      if (changed) {
        await AllBikes.updateOne(
          { _id: bike._id },
          { $set: { models: JSON.stringify(rows) } }
        );
        bikesTouched += 1;
      }
    }
  }

  return { bikesTouched, errors };
}

let pollerTimer = null;

function startPhpPosStockPoller() {
  if (process.env.VERCEL) return;
  if (!isConfigured()) return;
  if (pollerTimer) return;
  const raw = process.env.PHP_POS_POLL_MS;
  const interval = raw ? Number(raw) : 15 * 60 * 1000;
  if (!Number.isFinite(interval) || interval < 60_000) return;

  const tick = () => {
    pullStockFromPhpPosOnce()
      .then((r) => {
        if (r.errors && r.errors.length) {
          console.warn(
            "[PHP POS] stock pull completed with errors:",
            r.errors.slice(0, 5)
          );
        } else if (r.bikesTouched) {
          console.log(
            `[PHP POS] stock pull updated ${r.bikesTouched} bike document(s)`
          );
        }
      })
      .catch((e) => console.error("[PHP POS] stock pull failed:", e));
  };

  pollerTimer = setInterval(tick, interval);
  if (typeof pollerTimer.unref === "function") pollerTimer.unref();
  console.log(
    `[PHP POS] stock poller every ${Math.round(interval / 60000)} min (PHP_POS_POLL_MS)`
  );
}

module.exports = {
  parseModelsJson,
  syncBikeToPhpPos,
  syncPhpPosForImportedFullNames,
  pullStockFromPhpPosOnce,
  startPhpPosStockPoller,
  isPhpPosConfigured: isConfigured,
  validateCheckoutStock,
  classifyInquiryFulfillment,
  vendorAllowsSpecialOrder,
};
