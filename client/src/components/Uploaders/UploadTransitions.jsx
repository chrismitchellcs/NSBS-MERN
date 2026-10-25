import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Button,
  CircularProgress,
  Link,
  Paper,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { NAV_BAR_BG } from "components/General/NavBar";
import axios from "axios";
import { useEffect, useState } from "react";
import EditTransitions from "./EditTransitions";
import TransitionNeedsAttention from "./TransitionNeedsAttention";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

/**
 * Collapse runs of whitespace so B2B export typos (e.g. "Regulator SX  Deore" vs "Regulator SX Deore")
 * still map to one Mongo fullName key. Does not change how rows are merged into bikes[] or colors.
 */
function normalizeTransitionWhitespace(str) {
  return String(str).replace(/\s+/g, " ").trim();
}

/** Pull every numeric amount from B2B cell text (visible + hidden spans, N/A noise). */
function parseAllMoneyAmountsFromCell(str) {
  const s = String(str ?? "").replace(/,/g, "");
  const out = [];
  const re = /\$?\s*(\d+(?:\.\d{1,2})?)/g;
  let m;
  while ((m = re.exec(s)) !== null) {
    const n = parseFloat(m[1]);
    if (Number.isFinite(n)) out.push(n);
  }
  return out;
}

/** Cost for POS: REGULAR CUSTOMER PRICE, or SALE CUSTOMER PRICE when strictly lower (customer sale). */
function transitionRowCustomerCost(item) {
  const regVals = parseAllMoneyAmountsFromCell(item["REGULAR CUSTOMER PRICE"]);
  const saleVals = parseAllMoneyAmountsFromCell(item["SALE CUSTOMER PRICE"]);
  const regCost = regVals.length ? regVals[0] : NaN;
  if (!Number.isFinite(regCost)) return undefined;
  if (saleVals.length === 0) return regCost;
  const minSale = Math.min(...saleVals);
  if (minSale < regCost - 0.001) return minSale;
  return regCost;
}

/** Whole-dollar retail from a B2B price cell; same parsing as the server's `parsePrice`. */
function parseRetailPrice(priceString) {
  if (!priceString || typeof priceString !== "string") return 0;
  const parsed = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
  return isNaN(parsed) ? 0 : Math.round(parsed);
}

/** Legacy B2B part numbers carry the model year in the second segment (01.26.11.5515 → "26"). */
function legacyModelYearFromPartNumber(partNumber) {
  const parts = String(partNumber || "").trim().split(".");
  return parts.length >= 2 && /^\d{2}$/.test(parts[1]) ? parts[1] : null;
}

/**
 * Leading digits of the last segment of newer part numbers (TR.010.26056 → "26"). Not reliable as a
 * model year (TR.010.25884 is a 2026 Bandit colourway), so only a last resort.
 */
function modelYearFromNewPartNumber(partNumber) {
  const last = String(partNumber || "").trim().split(".").pop();
  const m = /^(\d{2})\d{3}$/.exec(last || "");
  return m ? m[1] : null;
}

function transitionNameKey(name) {
  return normalizeTransitionWhitespace(name).toLowerCase();
}

function parseRowsJson(raw) {
  try {
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/** Two-digit model year of a stored product ("26 Bottlerocket…" → "26"), or null. */
function productYearFromDoc(doc) {
  const prefix = String(doc?.fullName || "").trim().split(" ")[0];
  if (/^\d{2}$/.test(prefix)) return prefix;
  const y = doc?.year;
  if (y != null && y !== "" && Number.isFinite(Number(y))) return String(Number(y)).padStart(2, "0");
  return null;
}

/**
 * From the Transition products already in Mongo: which product each part number lives on (so
 * re-uploads keep SKUs where they were placed, including manual moves) and the newest model year
 * that already carries each name + colour. A part number on several products prefers a
 * non-archived one.
 */
function buildTransitionPlacementIndex(existingBikes) {
  const ownerByPartNumber = new Map();
  const yearsByNameColor = new Map();
  (existingBikes || []).forEach((doc) => {
    if (!doc || !doc.fullName) return;
    const year = productYearFromDoc(doc);
    const archived = Boolean(doc.archived);
    [...parseRowsJson(doc.models), ...parseRowsJson(doc.inStock)].forEach((row) => {
      if (!row) return;
      const pn = String(row.partNumber || "").trim();
      if (pn && year) {
        const current = ownerByPartNumber.get(pn);
        if (!current || (current.archived && !archived)) {
          ownerByPartNumber.set(pn, { fullName: doc.fullName, name: doc.name, year, archived });
        }
      }
      if (!archived && year && row.color != null && doc.name) {
        const key = `${transitionNameKey(doc.name)}|${transitionNameKey(row.color)}`;
        const prev = yearsByNameColor.get(key);
        if (prev == null || Number(year) > Number(prev)) yearsByNameColor.set(key, year);
      }
    });
  });
  return { ownerByPartNumber, yearsByNameColor };
}

/** Display and demo units are not sold on the site. */
function isDisplayOrDemoProduct(product) {
  return /\b(display|demo)\b/i.test(String(product || ""));
}

/** Higher = better stocked; used to pick one SKU when a model lists the same size/colour twice. */
function transitionAvailabilityRank(availability) {
  const s = String(availability || "").trim().toLowerCase();
  if (s.includes("in stock")) return 1000;
  const low = s.match(/low\s*stock\s*\((\d+)\)/);
  if (low) return 100 + (parseInt(low[1], 10) || 0);
  if (s.includes("pre-order") || s.includes("preorder") || s.includes("available to order")) {
    return 50;
  }
  if (s.includes("out of stock")) return 0;
  return 10;
}

const UploadTransitions = () => {
  const [data, setData] = useState(null);
  // const [stock, setStock] = useState(null);
  const [bikes, setBikes] = useState([]);
  const [uploadReport, setUploadReport] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchBikes = async () => {
    await axios
      .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/alltransition`, {
        withCredentials: true,
      })
      .then((res) => {
        setBikes(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  useEffect(() => {
    if (!uploadReport) return;
    document
      .getElementById("transition-stock-upload")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [uploadReport]);

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const html = e.target.result;

        const parser = new DOMParser();
        // @ts-ignore
        const doc = parser.parseFromString(html, "text/html");

        const table = doc.querySelector("table");
        if (!table) {
          reject(new Error("No table found in uploaded file"));
          return;
        }

        const rows = table.querySelectorAll("tr");

        const headers = Array.from(rows[0].querySelectorAll("td, th")).map(
          (el) => el.textContent.trim()
        );

        const parsedData = Array.from(rows)
          .slice(1)
          .map((row) => {
            const cells = Array.from(row.querySelectorAll("td, th"));
            const entry = {};

            let imageFound = false;

            cells.forEach((cell, index) => {
              const refImage = cell.getAttribute("refImage");
              if (refImage && !imageFound) {
                entry[
                  "PHOTO"
                ] = `https://www.transitionbikes.com/WebStoreImages/${refImage}`;
                imageFound = true;
              }

              const header = headers[index] || `Column ${index + 1}`;
              entry[header] = cell.textContent.trim();
            });

            if (!entry["Photo"]) {
              entry["Photo"] = "";
            }

            return entry;
          })
          .filter(Boolean);

        setData(parsedData);
        resolve(parsedData);
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  /**
   * Group B2B rows into models keyed by "YY Name", so each model year is its own product with its
   * own pricing. A part number already on a product stays there. Otherwise legacy part numbers
   * (01.26.11.5515) carry the year; newer ones (TR.010.26056) don't reliably, so they join the
   * newest year of the same model that already has that colour (this file or Mongo), else the
   * newest legacy model year in the file; the part-number digits are a last resort.
   */
  const transformStockList = (inputData = data, existingBikes = []) => {
    const stock = {};
    const skipped = [];
    const placedReason = new Map();
    let keptCount = 0;
    const { ownerByPartNumber, yearsByNameColor } = buildTransitionPlacementIndex(existingBikes);

    const parsedRows = [];
    inputData.forEach((item) => {
      const product = String(item.PRODUCT || "");
      const partNumber = String(item["PART NUMBER"] || "").trim();
      try {
        if (isDisplayOrDemoProduct(product)) {
          skipped.push({ product, partNumber, reason: "Display / demo unit" });
          return;
        }

        let cleaned = product.replace("Complete: ", "");
        cleaned = cleaned.replace(" - USA", "").trim();

        if (cleaned.includes("Complete: ")) {
          cleaned = cleaned.replace("Complete: ", "");
        }

        const parenIdx = cleaned.indexOf(" (");
        if (parenIdx < 0) {
          skipped.push({ product, partNumber, reason: "No size / colour in product name" });
          return;
        }
        const namePart = cleaned.slice(0, parenIdx);
        const metaPart = cleaned.slice(parenIdx + 2);
        const [size, color] = metaPart
          .replace(/\)\s*$/, "")
          .split(", ")
          .map((s) => normalizeTransitionWhitespace(s));
        const name = normalizeTransitionWhitespace(namePart);
        if (!partNumber) {
          skipped.push({ product, partNumber, reason: "Missing part number" });
          return;
        }

        parsedRows.push({
          item,
          product,
          partNumber,
          name,
          size,
          color,
          legacyYear: legacyModelYearFromPartNumber(partNumber),
        });
      } catch (error) {
        console.log("error uploading this bike: ", item);
        skipped.push({ product, partNumber, reason: "Could not parse row" });
      }
    });

    const legacyYearsByNameColor = new Map();
    let newestLegacyYear = null;
    parsedRows.forEach(({ name, color, legacyYear }) => {
      if (!legacyYear) return;
      if (newestLegacyYear == null || Number(legacyYear) > Number(newestLegacyYear)) {
        newestLegacyYear = legacyYear;
      }
      const key = `${transitionNameKey(name)}|${transitionNameKey(color)}`;
      const prev = legacyYearsByNameColor.get(key);
      if (prev == null || Number(legacyYear) > Number(prev)) {
        legacyYearsByNameColor.set(key, legacyYear);
      }
    });

    const resolveNewFormatYear = (name, color, partNumber) => {
      const key = `${transitionNameKey(name)}|${transitionNameKey(color)}`;
      const colorYear = [legacyYearsByNameColor.get(key), yearsByNameColor.get(key)]
        .filter(Boolean)
        .reduce((best, y) => (best == null || Number(y) > Number(best) ? y : best), null);
      if (colorYear) return { year: colorYear, reason: `colour already on the '${colorYear}` };
      if (newestLegacyYear) {
        return { year: newestLegacyYear, reason: `new colour, newest model year '${newestLegacyYear}` };
      }
      const pnYear = modelYearFromNewPartNumber(partNumber);
      return pnYear ? { year: pnYear, reason: `from part number '${pnYear}` } : { year: null };
    };

    parsedRows.forEach(({ item, product, partNumber, name: rowName, size, color, legacyYear }) => {
      let fullName;
      let modelYear;
      let name = rowName;
      const owner = ownerByPartNumber.get(partNumber);
      if (owner) {
        fullName = owner.fullName;
        modelYear = owner.year;
        name = owner.name || rowName;
        keptCount += 1;
      } else {
        modelYear = legacyYear;
        let reason = "year in part number";
        if (!modelYear) {
          const resolved = resolveNewFormatYear(rowName, color, partNumber);
          modelYear = resolved.year;
          reason = resolved.reason;
        }
        if (!modelYear) {
          skipped.push({
            product,
            partNumber,
            reason: "Could not determine model year",
          });
          return;
        }
        fullName = `${modelYear} ${rowName}`.trim();
        placedReason.set(partNumber, reason);
      }

      const bikeData = {
        size,
        color,
        partNumber,
        availability: item["AVAILABILITY"],
        _regularRaw: item["REGULAR RETAIL"],
        _saleRaw: item["SALE RETAIL"],
      };
      const rowCost = transitionRowCustomerCost(item);

      if (!stock[fullName]) {
        stock[fullName] = {
          bikes: [],
          modelYear,
          regularRetail: item["REGULAR RETAIL"],
          saleRetail: item["SALE RETAIL"],
          name,
          colors: {},
          ...(rowCost !== undefined && Number.isFinite(rowCost)
            ? { costPrice: rowCost }
            : {}),
        };
      } else if (
        stock[fullName].costPrice == null &&
        rowCost !== undefined &&
        Number.isFinite(rowCost)
      ) {
        stock[fullName].costPrice = rowCost;
      }

      stock[fullName].bikes.push(bikeData);
      stock[fullName].colors[color] = "";
    });

    // One SKU per size/colour: B2B sometimes lists the same variant under two part numbers.
    Object.entries(stock).forEach(([fullName, model]) => {
      const byVariant = new Map();
      model.bikes.forEach((row) => {
        const key = `${transitionNameKey(row.size)}|${transitionNameKey(row.color)}`;
        const existing = byVariant.get(key);
        if (!existing) {
          byVariant.set(key, row);
          return;
        }
        const keepNew =
          transitionAvailabilityRank(row.availability) >
          transitionAvailabilityRank(existing.availability);
        const dropped = keepNew ? existing : row;
        if (keepNew) byVariant.set(key, row);
        skipped.push({
          product: `${fullName} (${dropped.size}, ${dropped.color})`,
          partNumber: dropped.partNumber,
          reason: "Duplicate size / colour, kept the better-stocked SKU",
        });
      });
      model.bikes = Array.from(byVariant.values());
    });

    // Product price = cheapest variant (what listings show as "From $X"). Variants that cost more
    // carry their own price / saleprice so the bike page, checkout, and charge use the right one.
    Object.values(stock).forEach((model) => {
      const priced = model.bikes.map((row) => {
        const regular = parseRetailPrice(row._regularRaw);
        const sale = parseRetailPrice(row._saleRaw);
        return { row, regular, sale, effective: sale > 0 ? sale : regular };
      });
      const cheapest = priced
        .filter((p) => p.effective > 0)
        .reduce((best, p) => (!best || p.effective < best.effective ? p : best), null);
      if (cheapest) {
        model.regularRetail = cheapest.row._regularRaw;
        model.saleRetail = cheapest.row._saleRaw;
      }
      model.bikes = priced.map(({ row, regular, sale }) => {
        const { _regularRaw, _saleRaw, ...clean } = row;
        if (cheapest && (regular !== cheapest.regular || sale !== cheapest.sale)) {
          return { ...clean, price: regular, saleprice: sale };
        }
        return clean;
      });
    });

    const newlyPlacedSkus = [];
    Object.entries(stock).forEach(([fullName, model]) => {
      model.bikes.forEach((row) => {
        if (!placedReason.has(row.partNumber)) return;
        newlyPlacedSkus.push({
          fullName,
          product: `${model.name} (${row.size}, ${row.color})`,
          partNumber: row.partNumber,
          yearReason: placedReason.get(row.partNumber),
        });
      });
    });

    return { stock, skipped, newlyPlacedSkus, keptCount };
  };

  const addBikesToDB = async (stockData) => {
    const res = await axios.post(
      `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/transition`,
      { stock: stockData },
      { withCredentials: true }
    );
    return res.data;
  };

  const uploadBikes = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadReport(null);
    setUploading(true);
    try {
      const parsedData = await uploadFile(file);
      // Fresh copy so SKUs stay on the products they were last placed on (including manual moves).
      const existingRes = await axios.get(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/alltransition`,
        { withCredentials: true }
      );
      const existingBikes = Array.isArray(existingRes.data) ? existingRes.data : [];
      const { stock, skipped, newlyPlacedSkus, keptCount } = transformStockList(
        parsedData,
        existingBikes
      );
      const report = await addBikesToDB(stock);
      setUploadReport({
        ...(report ?? { message: "Upload completed" }),
        skippedRows: skipped,
        newlyPlacedSkus,
        keptCount,
      });
      await fetchBikes();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Could not process the stock file.";
      alert(msg);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <Stack spacing={3} alignItems="stretch">
      <TransitionNeedsAttention bikes={bikes} onRefresh={fetchBikes} />
      <Paper
        id="transition-stock-upload"
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, border: "1px solid", borderColor: "divider", scrollMarginTop: 96 }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={700} sx={{ color: NAV_BAR_BG }}>
            Upload Transition stock file
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
            Export HTML from the B2B stock list and upload it here. It creates/updates Transition models and availability.
            Below, use <strong>Public</strong> for the storefront and <strong>Archived</strong> for old stock you want hidden; the list orders drafts first, then live bikes, then archived.
            To get the file: click{" "}
            <Link rel="noopener noreferrer" href="https://www.b2b.transitionbikes.com/Account.cfm" target="_blank">
              Transition B2B
            </Link>
            , sign in, open <strong>Stock List</strong>, then download as Excel/HTML as you currently do.
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" useFlexGap>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <CloudUploadIcon />}
              disabled={uploading}
              sx={{ bgcolor: NAV_BAR_BG }}
            >
              {uploading ? "Uploading…" : "Choose stock file"}
              <VisuallyHiddenInput
                type="file"
                onChange={uploadBikes}
                accept=".xls,.html,.htm,text/html"
                disabled={uploading}
              />
            </Button>
            {uploading ? (
              <Typography variant="body2" color="text.secondary">
                Parsing file and saving to the database…
              </Typography>
            ) : null}
          </Stack>

          {uploadReport ? (
            <Alert
              severity="success"
              onClose={() => setUploadReport(null)}
              sx={{ mt: 1 }}
            >
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Stock file applied
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>{uploadReport.matchedCount ?? 0}</strong> model(s) in this file were processed
                (matched in Mongo).{" "}
                <strong>{uploadReport.modifiedCount ?? 0}</strong> document(s) had stored fields change,{" "}
                <strong>{uploadReport.upsertedCount ?? 0}</strong> new document(s) inserted.
              </Typography>
              {(uploadReport.modifiedCount ?? 0) === 0 &&
              (uploadReport.upsertedCount ?? 0) === 0 &&
              (uploadReport.matchedCount ?? 0) > 0 ? (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                  Mongo reports no writes because values already matched your database (re-upload of the same
                  stock). Availability and pricing were still checked against existing documents.
                </Typography>
              ) : null}

              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                Newly placed SKUs ({uploadReport.newlyPlacedSkus?.length ?? 0})
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
                Part numbers seen for the first time. Check they landed on the right product.{" "}
                {uploadReport.keptCount ?? 0} other SKU(s) stayed on the products they were already on.
              </Typography>
              {uploadReport.newlyPlacedSkus?.length > 0 ? (
                <>
                  <Stack component="ul" sx={{ m: 0, pl: 2.5, mb: 1.5, maxHeight: 160, overflow: "auto" }}>
                    {uploadReport.newlyPlacedSkus.map((row) => (
                      <Typography key={row.partNumber} component="li" variant="body2">
                        <strong>{row.fullName}</strong> ·{" "}
                        <Typography component="span" variant="caption" sx={{ fontFamily: "monospace" }}>
                          {row.partNumber}
                        </Typography>{" "}
                        · {row.product}
                        {row.yearReason ? (
                          <Typography component="span" variant="caption" color="text.secondary">
                            {" "}
                            ({row.yearReason})
                          </Typography>
                        ) : null}
                      </Typography>
                    ))}
                  </Stack>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  None. Every SKU in this file was already on a product.
                </Typography>
              )}

              {uploadReport.noLongerListed ? (
                <>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                    No longer on Transition&apos;s list ({uploadReport.noLongerListed.count ?? 0})
                  </Typography>
                  {uploadReport.noLongerListed.skipped ? (
                    <Typography variant="body2" color="warning.main" sx={{ mb: 1.5 }}>
                      {uploadReport.noLongerListed.skipReason}
                    </Typography>
                  ) : uploadReport.noLongerListed.items?.length > 0 ? (
                    <>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
                        Active products with no SKUs in this file. Their vendor variants are now marked
                        out of stock. Archive any you no longer want to list.
                      </Typography>
                      <Stack component="ul" sx={{ m: 0, pl: 2.5, mb: 1.5, maxHeight: 160, overflow: "auto" }}>
                        {uploadReport.noLongerListed.items.map((row) => (
                          <Typography key={row.fullName} component="li" variant="body2">
                            <strong>{row.fullName}</strong> · {row.public ? "Live" : "Draft"}
                            <Typography component="span" variant="caption" color="text.secondary">
                              {" "}
                              ·{" "}
                              {row.markedVariants > 0
                                ? `${row.markedVariants} variant(s) marked out of stock`
                                : "already out of stock"}
                            </Typography>
                          </Typography>
                        ))}
                      </Stack>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      None. Every active product is in this file.
                    </Typography>
                  )}
                </>
              ) : null}

              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                Skipped rows ({uploadReport.skippedRows?.length ?? 0})
              </Typography>
              {uploadReport.skippedRows?.length > 0 ? (
                <Stack component="ul" sx={{ m: 0, pl: 2.5, mb: 1.5, maxHeight: 160, overflow: "auto" }}>
                  {uploadReport.skippedRows.map((row, i) => (
                    <Typography key={`${row.partNumber}-${i}`} component="li" variant="body2">
                      {row.product}{" "}
                      <Typography component="span" variant="caption" sx={{ fontFamily: "monospace" }}>
                        {row.partNumber}
                      </Typography>
                      <br />
                      <Typography component="span" variant="caption" color="text.secondary">
                        {row.reason}
                      </Typography>
                    </Typography>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  None. Every row in the file was imported.
                </Typography>
              )}

              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                New bike models ({uploadReport.newBikes?.count ?? 0})
              </Typography>
              {uploadReport.newBikes?.count > 0 ? (
                <Stack
                  component="ul"
                  sx={{ m: 0, pl: 2.5, mb: 1.5, maxHeight: 160, overflow: "auto" }}
                >
                  {(uploadReport.newBikes.models || []).map((name) => (
                    <Typography key={name} component="li" variant="body2">
                      {name}
                    </Typography>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  None — every model in this file was already in the database.
                </Typography>
              )}
              {uploadReport.newBikes?.truncated ? (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                  Showing first {uploadReport.newBikes.models?.length ?? 0} names; see Mongo or re-upload for full list.
                </Typography>
              ) : null}

              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                Newly low stock ({uploadReport.newlyLowStock?.count ?? 0})
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
                SKUs that were not “Low Stock” before this upload but are now (same part number).
              </Typography>
              {uploadReport.newlyLowStock?.count > 0 ? (
                <Stack sx={{ maxHeight: 220, overflow: "auto", gap: 0.75 }}>
                  {(uploadReport.newlyLowStock.items || []).map((row, i) => (
                    <Typography key={`${row.partNumber}-${i}`} variant="body2" component="div">
                      <strong>{row.fullName}</strong> · {row.color} / {row.size} ·{" "}
                      <Typography component="span" variant="caption" sx={{ fontFamily: "monospace" }}>
                        {row.partNumber}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {row.previousAvailability} → {row.currentAvailability}
                      </Typography>
                    </Typography>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  None — no SKUs crossed from non–low stock into low stock on this run.
                </Typography>
              )}
              {uploadReport.newlyLowStock?.truncated ? (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  Showing first {uploadReport.newlyLowStock.items?.length ?? 0} rows.
                </Typography>
              ) : null}
            </Alert>
          ) : null}
        </Stack>
      </Paper>

      <EditTransitions bikes={bikes} setBikes={setBikes} />
    </Stack>
  );
};

export default UploadTransitions;
