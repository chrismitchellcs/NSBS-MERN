import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { NAV_BAR_BG } from "components/General/NavBar";
import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import EditNorco from "./EditNorco";

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

/** Whole-word match on model code / descriptions — not imported from POS. */
const NORCO_POS_EXCLUDED_MODEL_RE =
  /\b(BIGFOOT|SCENE|TACTIC|SECTION|XFR|INDIE)\b/i;

export function isNorcoPosRowExcluded(row) {
  const modelCode = String(row["Model Code"] ?? "").trim();
  const description = String(row["Description"] ?? "").trim();
  const french = String(row["French Description"] ?? "").trim();
  return NORCO_POS_EXCLUDED_MODEL_RE.test(
    `${modelCode} ${description} ${french}`
  );
}

function norcoNumericCell(v) {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Group Norco Canada POS rows by model (year + Model Code). One Mongo doc per model;
 * SKUs become `models` JSON like Transition.
 * Storefront: `price` / `saleprice` from Original MSRP vs MSRP when any variant is on sale.
 * Model `costPrice`: max of per-row dealer cost (special when positive, else dealer) across SKUs.
 * @returns {{ stock: Record<string, object>, excludedRowCount: number }}
 */
export function transformNorcoPosRows(rows) {
  const groups = {};
  let excludedRowCount = 0;
  for (const row of rows) {
    if (isNorcoPosRowExcluded(row)) {
      excludedRowCount += 1;
      continue;
    }
    const itemNumber = String(row["Item Number"] ?? "").trim();
    const modelCode = String(row["Model Code"] ?? "").trim();
    const yearRaw = row["Model Year"];
    if (!itemNumber || !modelCode || yearRaw === "" || yearRaw == null) continue;
    const year = Number(yearRaw);
    if (!Number.isFinite(year)) continue;

    const fullName = `Norco ${year} ${modelCode.replace(/\s+/g, " ")}`.trim();
    const size = String(row["Size"] ?? "").trim();
    const color = String(row["Colour"] ?? row["Color"] ?? "").trim() || "—";

    const origMsrp = norcoNumericCell(row["Original MSRP"]);
    const msrp = norcoNumericCell(row["MSRP"]);
    const dealer = norcoNumericCell(row["Dealer Price"]);
    const dealerSpecial = norcoNumericCell(row["Dealer Special Price"]);

    let costPrice = NaN;
    if (Number.isFinite(dealerSpecial) && dealerSpecial > 0) costPrice = dealerSpecial;
    else if (Number.isFinite(dealer) && dealer > 0) costPrice = dealer;

    if (!groups[fullName]) {
      groups[fullName] = {
        modelYear: year,
        name: modelCode,
        bikes: [],
        colors: {},
        _maxOrig: 0,
        _minSaleMsrp: null,
        _maxMsrpNoSale: 0,
        _anyRowSale: false,
        _costMax: null,
      };
    }
    const g = groups[fullName];

    const rowOnSale =
      Number.isFinite(origMsrp) &&
      origMsrp > 0 &&
      Number.isFinite(msrp) &&
      msrp > 0 &&
      msrp < origMsrp;

    if (rowOnSale) {
      g._anyRowSale = true;
      g._maxOrig = Math.max(g._maxOrig, origMsrp);
      if (g._minSaleMsrp == null) g._minSaleMsrp = msrp;
      else g._minSaleMsrp = Math.min(g._minSaleMsrp, msrp);
    } else {
      if (Number.isFinite(msrp) && msrp > 0) g._maxMsrpNoSale = Math.max(g._maxMsrpNoSale, msrp);
      if (Number.isFinite(origMsrp) && origMsrp > 0) g._maxMsrpNoSale = Math.max(g._maxMsrpNoSale, origMsrp);
    }

    if (Number.isFinite(costPrice) && costPrice > 0) {
      g._costMax =
        g._costMax == null ? costPrice : Math.max(g._costMax, costPrice);
    }

    const bikeRow = {
      partNumber: itemNumber,
      size,
      color,
      wheelSize: String(row["Wheel Size"] ?? "").trim(),
      description: String(row["Description"] ?? "").trim(),
      availability: "",
    };
    g.bikes.push(bikeRow);
    if (!Object.prototype.hasOwnProperty.call(g.colors, color)) {
      g.colors[color] = "";
    }
  }

  for (const key of Object.keys(groups)) {
    const g = groups[key];
    if (
      g._anyRowSale &&
      g._maxOrig > 0 &&
      g._minSaleMsrp != null &&
      g._minSaleMsrp < g._maxOrig
    ) {
      g.price = g._maxOrig;
      g.saleprice = g._minSaleMsrp;
    } else {
      g.price = g._maxMsrpNoSale > 0 ? g._maxMsrpNoSale : g._maxOrig;
      g.saleprice = null;
    }
    delete g._maxOrig;
    delete g._minSaleMsrp;
    delete g._maxMsrpNoSale;
    delete g._anyRowSale;
    if (g._costMax != null) {
      g.costPrice = g._costMax;
    }
    delete g._costMax;
  }

  return { stock: groups, excludedRowCount };
}

const UploadNorco = () => {
  const [bikes, setBikes] = useState([]);
  const [uploadReport, setUploadReport] = useState(null);
  const [purgeReport, setPurgeReport] = useState(null);
  const [purging, setPurging] = useState(false);

  const fetchBikes = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/allnorco`,
        { withCredentials: true }
      );
      setBikes(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const uploadBikes = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadReport(null);
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, { type: "array" });
      const sheetName = wb.SheetNames[0];
      if (!sheetName) {
        throw new Error("Workbook has no sheets.");
      }
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: "" });
      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error("No rows found in the first sheet.");
      }
      const { stock, excludedRowCount } = transformNorcoPosRows(rows);
      const modelCount = Object.keys(stock).length;
      if (modelCount === 0) {
        throw new Error(
          "No valid bike rows (need Item Number, Model Code, Model Year). Check column headers match the Norco POS file."
        );
      }
      const res = await axios.post(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/norco`,
        { stock },
        { withCredentials: true }
      );
      setUploadReport({ ...res.data, excludedRowCount });
      await fetchBikes();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Could not process the file.";
      alert(msg);
    } finally {
      event.target.value = "";
    }
  };

  const purgeExcludedFromDb = async () => {
    if (
      !window.confirm(
        "Delete every Norco catalog bike whose name matches the excluded list (Bigfoot, Scene, Tactic, Section, XFR, Indie)? Mongo documents and Cloudinary photos for those bikes only are removed. Other Norco models stay."
      )
    ) {
      return;
    }
    setPurgeReport(null);
    setPurging(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/norco/purge-excluded`,
        {},
        { withCredentials: true }
      );
      setPurgeReport(res.data);
      await fetchBikes();
    } catch (e) {
      alert(e?.response?.data?.error || e?.message || "Purge failed.");
    } finally {
      setPurging(false);
    }
  };

  return (
    <Stack spacing={3} alignItems="stretch">
      <Paper
        id="norco-stock-upload"
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          scrollMarginTop: 96,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={700} sx={{ color: NAV_BAR_BG }}>
            Upload Norco B2B POS file
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
            Use the <strong>.xlsx</strong> Canada POS export (e.g. &quot;Canada POS File&quot; sheet). Rows are
            grouped by model year + model code; each SKU stays a variant with size and colour. New imports are{" "}
            <strong>drafts</strong> until you mark them public. List pricing uses <strong>Original MSRP</strong> vs{" "}
            <strong>MSRP</strong> so on-sale models show a strike-through list price; one <strong>cost</strong> per
            model (from dealer columns, max across SKUs). Use <strong>In store</strong> below to track what you
            actually have.
          </Typography>
          <Box>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{ bgcolor: NAV_BAR_BG }}
            >
              Choose .xlsx file
              <VisuallyHiddenInput type="file" onChange={uploadBikes} accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
            </Button>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Clean up old imports
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, maxWidth: 720 }}>
              If you imported before excluded models were filtered out, remove those documents in one step
              (same names as skipped POS rows). Or delete a single bike with <strong>Delete bike</strong> in the
              list below.
            </Typography>
            <Button
              type="button"
              variant="outlined"
              color="error"
              disabled={purging}
              onClick={purgeExcludedFromDb}
              sx={{ textTransform: "none" }}
            >
              {purging ? "Removing…" : "Delete excluded models from database"}
            </Button>
          </Box>

          {purgeReport ? (
            <Alert
              severity={purgeReport.deletedCount > 0 ? "warning" : "info"}
              onClose={() => setPurgeReport(null)}
            >
              <Typography variant="body2">
                Removed <strong>{purgeReport.deletedCount}</strong> Norco catalog document(s) matching excluded
                names.
              </Typography>
              {purgeReport.truncated ? (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  Showing first {purgeReport.fullNames?.length ?? 0} names.
                </Typography>
              ) : null}
              {purgeReport.fullNames?.length > 0 ? (
                <Stack
                  component="ul"
                  sx={{ m: 0, pl: 2.5, mt: 1, maxHeight: 140, overflow: "auto" }}
                >
                  {purgeReport.fullNames.map((name) => (
                    <Typography key={name} component="li" variant="caption">
                      {name}
                    </Typography>
                  ))}
                </Stack>
              ) : null}
            </Alert>
          ) : null}

          {uploadReport ? (
            <Alert severity="success" onClose={() => setUploadReport(null)} sx={{ mt: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Catalog file applied
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Updated {uploadReport.modifiedCount ?? 0} model(s),{" "}
                {uploadReport.upsertedCount ?? 0} new document(s) in Mongo.
                {(uploadReport.excludedRowCount ?? 0) > 0 ? (
                  <>
                    {" "}
                    Skipped {uploadReport.excludedRowCount} POS row(s) (Bigfoot, Scene, Tactic,
                    Section, XFR, Indie — not stocked on the site).
                  </>
                ) : null}
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                New models ({uploadReport.newBikes?.count ?? 0})
              </Typography>
              {uploadReport.newBikes?.count > 0 ? (
                <Stack component="ul" sx={{ m: 0, pl: 2.5, mb: 0, maxHeight: 160, overflow: "auto" }}>
                  {(uploadReport.newBikes.models || []).map((name) => (
                    <Typography key={name} component="li" variant="body2">
                      {name}
                    </Typography>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  None — every model in this file was already in the database.
                </Typography>
              )}
              {uploadReport.newBikes?.truncated ? (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  Showing first {uploadReport.newBikes.models?.length ?? 0} names.
                </Typography>
              ) : null}
            </Alert>
          ) : null}
        </Stack>
      </Paper>

      <EditNorco bikes={bikes} setBikes={setBikes} />
    </Stack>
  );
};

export default UploadNorco;
