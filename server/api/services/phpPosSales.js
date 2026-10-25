const { request, isConfigured } = require("./phpPosClient");

function asArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.locations)) return data.locations;
  return [];
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

/** What a customer pays (sale if set, else list). Used for suspended-sale cart lines. */
function effectiveSellPriceFromBike(bike) {
  const sale =
    bike && bike.saleprice != null && bike.saleprice !== ""
      ? Number(bike.saleprice)
      : NaN;
  if (Number.isFinite(sale) && sale > 0) return sale;
  const p = Number(bike && bike.price);
  return Number.isFinite(p) && p >= 0 ? p : 0;
}

function suspendedSaleTypeId() {
  const n = Number.parseInt(
    String(process.env.PHP_POS_SUSPENDED_SALE_TYPE_ID || ""),
    10
  );
  return Number.isFinite(n) && n > 0 ? n : null;
}

function saleEmployeeId() {
  const n = Number.parseInt(
    String(process.env.PHP_POS_SALE_EMPLOYEE_ID || ""),
    10
  );
  return Number.isFinite(n) && n > 0 ? n : null;
}

let cachedDefaultLocationId = null;

async function resolveDefaultLocationId() {
  if (process.env.PHP_POS_LOCATION_ID) {
    return String(process.env.PHP_POS_LOCATION_ID).trim();
  }
  if (cachedDefaultLocationId) return cachedDefaultLocationId;
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

async function getItemById(itemId) {
  const res = await request("get", `/items/${itemId}`);
  if (res.status >= 400) return null;
  return res.data;
}

async function setItemLocationQuantity(itemId, locationId, quantity) {
  const qty = Math.max(0, Math.floor(Number(quantity)) || 0);
  const payload = {
    locations: {
      [String(locationId)]: { quantity: qty },
    },
  };
  const res = await request("post", `/items/${itemId}`, payload);
  if (res.status >= 400) {
    throw new Error(
      `PHP POS set location qty failed: ${res.status} ${JSON.stringify(res.data)}`
    );
  }
  return true;
}

async function stagePlusOneForSpecialOrder(itemId) {
  const locId = await resolveDefaultLocationId();
  if (!locId) {
    throw new Error("PHP POS: no location id for special-order staging");
  }
  const item = await getItemById(itemId);
  if (!item) {
    throw new Error(`PHP POS: item ${itemId} not found for staging`);
  }
  const current = sumLocationQuantities(item);
  const next = current + 1;
  await setItemLocationQuantity(itemId, locId, next);
  return { locationId: locId, previousQty: current, newQty: next };
}

async function createSuspendedEcommerceSale({
  itemId,
  quantity = 1,
  unitPrice,
  comment,
  customerName,
  customerEmail,
  customerPhone,
}) {
  const suspended = suspendedSaleTypeId();
  if (suspended == null) {
    throw new Error(
      "PHP_POS_SUSPENDED_SALE_TYPE_ID is not set (E-Commerce suspended type id)"
    );
  }

  const qty = Math.max(1, Math.floor(Number(quantity)) || 1);
  const price = Number(unitPrice);
  const cartItem = {
    item_id: Number(itemId),
    quantity: qty,
  };
  if (Number.isFinite(price) && price >= 0) {
    cartItem.unit_price = price;
  }

  const payload = {
    suspended,
    comment: String(comment || "WEBSITE INQUIRY – NOT PAID").slice(0, 2000),
    cart_items: [cartItem],
  };

  const emp = saleEmployeeId();
  if (emp != null) {
    payload.sold_by_employee_id = emp;
    payload.employee_id = emp;
  }

  const who = [
    customerName && `Customer: ${customerName}`,
    customerEmail && `Email: ${customerEmail}`,
    customerPhone && `Phone: ${customerPhone}`,
  ]
    .filter(Boolean)
    .join(" | ");
  if (who) {
    payload.comment = `${payload.comment}\n${who}`.slice(0, 2000);
  }

  const res = await request("post", "/sales", payload);
  if (res.status >= 400) {
    throw new Error(
      `PHP POS create suspended sale failed: ${res.status} ${JSON.stringify(
        res.data
      )}`
    );
  }
  const data = res.data || {};
  const saleId = data.sale_id ?? data.id ?? data.saleId ?? null;
  return { saleId, data };
}

/**
 * @returns {{ ok: boolean, fulfillment: string, stagedPlusOne: boolean, saleId?: *, error?: string, skipped?: boolean }}
 */
async function fulfillInquiryPosHold({
  fulfillment,
  bike,
  row,
  phpPosItemId,
  customerName,
  customerEmail,
  customerPhone,
}) {
  const base = {
    fulfillment,
    stagedPlusOne: false,
    ok: false,
  };

  if (fulfillment === "inquiry_only") {
    return { ...base, ok: true, skipped: true };
  }

  if (!isConfigured()) {
    return { ...base, error: "PHP POS is not configured" };
  }

  const itemId =
    phpPosItemId != null && Number(phpPosItemId) > 0
      ? Number(phpPosItemId)
      : row && row.phpPosItemId != null
      ? Number(row.phpPosItemId)
      : NaN;

  if (!Number.isFinite(itemId) || itemId <= 0) {
    return {
      ...base,
      error: "No PHP POS item id linked for this variant",
    };
  }

  try {
    let stagedPlusOne = false;
    if (fulfillment === "special_order") {
      await stagePlusOneForSpecialOrder(itemId);
      stagedPlusOne = true;
    }

    const unitPrice = effectiveSellPriceFromBike(bike || {});
    const { saleId } = await createSuspendedEcommerceSale({
      itemId,
      quantity: 1,
      unitPrice,
      comment: `WEBSITE INQUIRY – NOT PAID | ${
        bike?.fullName || bike?.name || ""
      } | Mongo ${bike?._id || ""}`,
      customerName,
      customerEmail,
      customerPhone,
    });

    return {
      fulfillment,
      stagedPlusOne,
      ok: true,
      saleId,
    };
  } catch (e) {
    console.error("[PHP POS] fulfillInquiryPosHold:", e);
    return {
      ...base,
      error: e.message || String(e),
    };
  }
}

module.exports = {
  setItemLocationQuantity,
  stagePlusOneForSpecialOrder,
  createSuspendedEcommerceSale,
  fulfillInquiryPosHold,
  suspendedSaleTypeId,
};
