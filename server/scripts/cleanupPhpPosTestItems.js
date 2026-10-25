/**
 * One-shot cleanup for the PHP POS *test* tenant.
 * Frees item_number slots left by UI "deletes" that still block creates (HTTP 405).
 *
 * Single pass: find item → free immediately (so progress survives rate limits).
 *
 * Usage (from server/):
 *   node scripts/cleanupPhpPosTestItems.js           # dry-run (scan only)
 *   node scripts/cleanupPhpPosTestItems.js --apply   # free as we go
 *
 * Env:
 *   PHP_POS_CLEANUP_MAX_ID=400
 *   PHP_POS_CLEANUP_MIN_ID=1
 *   PHP_POS_CLEANUP_READ_MS=250
 *   PHP_POS_CLEANUP_WRITE_MS=3500
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const {
  request,
  isConfigured,
  getApiRoot,
} = require("../api/services/phpPosClient");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function argFlag(name) {
  return process.argv.includes(name);
}

function checkpointPath() {
  return path.join(__dirname, ".phpPosCleanup.checkpoint.json");
}

function loadCheckpoint() {
  try {
    return JSON.parse(fs.readFileSync(checkpointPath(), "utf8"));
  } catch {
    return { freedIds: [], lastId: null, results: [] };
  }
}

function saveCheckpoint(state) {
  fs.writeFileSync(checkpointPath(), JSON.stringify(state, null, 2));
}

async function getItemWithRetry(id) {
  let lastErr = null;
  for (let attempt = 1; attempt <= 8; attempt++) {
    const res = await request("get", `/items/${id}`);
    if (res.status === 401) {
      lastErr = new Error(`GET /items/${id} 401`);
      const wait = Math.min(180_000, 45_000 * attempt);
      console.warn(
        `[cleanup] rate limit GET id=${id} attempt ${attempt}/8 — wait ${Math.round(wait / 1000)}s`
      );
      await sleep(wait);
      continue;
    }
    if (res.status >= 400 || !res.data || res.data.item_id == null) return null;
    return res.data;
  }
  throw lastErr || new Error(`GET /items/${id} failed after retries`);
}

async function freeItem(item, writeMs) {
  const id = item.item_id;
  const pn = item.item_number != null ? String(item.item_number).trim() : "";
  const name = String(item.name || "").slice(0, 60);

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      await sleep(writeMs);
      let del = await request("delete", `/items/${id}`);
      if (del.status === 401) {
        console.warn(`[cleanup] DELETE rate limited id=${id} — wait 60s`);
        await sleep(60_000);
        del = await request("delete", `/items/${id}`);
      }
      if (del.status < 400) {
        return { id, pn, name, action: "deleted" };
      }

      const stamp = Date.now();
      const newPn = pn
        ? `DELETED-${pn}-${stamp}`
        : `DELETED-EMPTY-${id}-${stamp}`;

      await sleep(writeMs);
      let upd = await request("post", `/items/${id}`, {
        item_number: newPn.slice(0, 240),
        item_inactive: true,
        name: (`DELETED ${name || id}`).slice(0, 240),
      });
      if (upd.status === 401) {
        console.warn(`[cleanup] UPDATE rate limited id=${id} — wait 60s`);
        await sleep(60_000);
        upd = await request("post", `/items/${id}`, {
          item_number: newPn.slice(0, 240),
          item_inactive: true,
          name: (`DELETED ${name || id}`).slice(0, 240),
        });
      }
      if (upd.status >= 400) {
        return {
          id,
          pn,
          name,
          action: "failed",
          detail: `delete=${del.status} update=${upd.status}`,
        };
      }
      return {
        id,
        pn,
        name,
        action: "renamed-inactive",
        newPn: upd.data && upd.data.item_number,
      };
    } catch (e) {
      const wait = Math.min(120_000, 20_000 * attempt);
      console.warn(
        `[cleanup] freeItem id=${id} network error attempt ${attempt}/5: ${e.message || e} — wait ${Math.round(wait / 1000)}s`
      );
      await sleep(wait);
    }
  }
  return { id, pn, name, action: "failed", detail: "network retries exhausted" };
}

async function main() {
  const apply = argFlag("--apply");
  if (!isConfigured()) {
    console.error("PHP POS is not configured (PHP_BASE_URL / PHP_API_KEY).");
    process.exit(1);
  }

  const maxId = Math.max(1, Number(process.env.PHP_POS_CLEANUP_MAX_ID) || 400);
  const minId = Math.max(1, Number(process.env.PHP_POS_CLEANUP_MIN_ID) || 1);
  const readMs = Math.max(0, Number(process.env.PHP_POS_CLEANUP_READ_MS) || 250);
  const writeMs = Math.max(
    0,
    Number(process.env.PHP_POS_CLEANUP_WRITE_MS) || 3500
  );

  const state = loadCheckpoint();
  const freedSet = new Set(state.freedIds || []);
  // Resume: continue downward from last processed id if present.
  let startId =
    state.lastId != null && Number(state.lastId) > 0
      ? Number(state.lastId) - 1
      : maxId;
  startId = Math.min(startId, maxId);

  console.log(
    JSON.stringify(
      {
        mode: apply ? "APPLY" : "DRY_RUN",
        api: getApiRoot(),
        startId,
        minId,
        readMs,
        writeMs,
        alreadyFreed: freedSet.size,
      },
      null,
      2
    )
  );

  const summary = {};
  let foundCount = 0;

  for (let id = startId; id >= minId; id--) {
    state.lastId = id;
    await sleep(readMs);
    const item = await getItemWithRetry(id);
    if (!item) {
      if (id % 50 === 0) console.log(`[cleanup] scan id=${id} (empty)`);
      saveCheckpoint(state);
      continue;
    }
    foundCount += 1;
    console.log(
      `[cleanup] found id=${item.item_id} pn=${item.item_number || "(null)"} name=${String(item.name || "").slice(0, 50)}`
    );

    if (!apply) {
      summary["dry-run"] = (summary["dry-run"] || 0) + 1;
      saveCheckpoint(state);
      continue;
    }

    if (freedSet.has(item.item_id)) {
      console.log(`[cleanup] skip already-freed id=${item.item_id}`);
      continue;
    }

    const r = await freeItem(item, writeMs);
    summary[r.action] = (summary[r.action] || 0) + 1;
    state.results = state.results || [];
    state.results.push(r);
    if (r.action === "deleted" || r.action === "renamed-inactive") {
      freedSet.add(item.item_id);
      state.freedIds = [...freedSet];
    }
    console.log(`[cleanup] ${r.action} id=${r.id} pn=${r.pn || "(null)"}`);
    saveCheckpoint(state);
  }

  console.log("[cleanup] DONE", {
    foundCount,
    summary,
    freedTotal: freedSet.size,
  });

  if (apply) {
    const testPn = `NSBS-CLEANUP-CHECK-${Date.now()}`;
    await sleep(writeMs);
    const create = await request("post", "/items", {
      name: "NSBS cleanup smoke",
      item_number: testPn,
      unit_price: 1,
      category_id: Number(process.env.PHP_POS_ITEM_CATEGORY_ID || 1),
      is_serialized: true,
    });
    console.log("[cleanup] smoke create", {
      status: create.status,
      id: create.data && create.data.item_id,
      pn: create.data && create.data.item_number,
    });
  } else {
    console.log("[cleanup] dry-run only — re-run with --apply to free item_numbers");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
