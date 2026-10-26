import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { invalidateAllBikesCache } from "api/getAllBikesCached";
import { useEffect, useMemo, useState } from "react";
import { NAV_BAR_BG } from "utils/brandColors";

const apiBase = process.env.REACT_APP_VERCEL_DOMAIN;

/** Values the shop understands (see utils/availability.js). */
export const STOCK_OPTIONS = [
  { value: "In Store", label: "In store", color: "#15803d", bg: "rgba(22,163,74,0.10)" },
  { value: "Available to Order", label: "To order", color: "#1d4ed8", bg: "rgba(37,99,235,0.08)" },
  { value: "Pre-Order", label: "Pre-order", color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
  { value: "Out of Stock", label: "Out", color: "rgba(0,0,0,0.55)", bg: "rgba(0,0,0,0.05)" },
];
const NOT_OFFERED = "__none__";

const optionFor = (value) =>
  STOCK_OPTIONS.find((o) => o.value.toLowerCase() === String(value || "").trim().toLowerCase());

function parseRows(raw) {
  try {
    const rows = JSON.parse(raw || "[]");
    return Array.isArray(rows) ? rows.filter((r) => r && typeof r === "object") : [];
  } catch {
    return [];
  }
}

function parseColors(raw) {
  try {
    const obj = JSON.parse(raw || "{}");
    return obj && typeof obj === "object" && !Array.isArray(obj) ? obj : {};
  } catch {
    return {};
  }
}

const norm = (v) => String(v || "").trim().toLowerCase().replace(/\s+/g, " ");
/** First spelling wins; "Raw" and "raw " are the same colour (matches the shop's matching). */
const uniq = (list) => {
  const seen = new Set();
  return list.filter((v) => {
    const k = norm(v);
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};
const cellKey = (color, size) => `${norm(color)}\u0000${norm(size)}`;

/** "3 in store · 5 to order · 2 out" for the collapsed bike row. */
export function stockSummary(modelsJson) {
  const counts = {};
  parseRows(modelsJson).forEach((r) => {
    const o = optionFor(r.availability);
    const label = o ? o.label.toLowerCase() : "other";
    counts[label] = (counts[label] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([label, n]) => `${n} ${label}`)
    .join(" · ");
}

/**
 * Availability for every colour × size of a Norco / Ibis / other bike. Edits stay local until
 * Save, which sends only `models` (and `colors` when a colour was added).
 */
export default function OtherBikeStockGrid({ bike, onSaved }) {
  const [rows, setRows] = useState(() => parseRows(bike.models));
  const [colorsObj, setColorsObj] = useState(() => parseColors(bike.colors));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [savedNote, setSavedNote] = useState("");

  useEffect(() => {
    setRows(parseRows(bike.models));
    setColorsObj(parseColors(bike.colors));
    setDirty(false);
  }, [bike._id, bike.models, bike.colors]);

  const sizes = useMemo(() => uniq(rows.map((r) => String(r.size || "").trim())), [rows]);
  const colors = useMemo(
    () => uniq([...Object.keys(colorsObj), ...rows.map((r) => String(r.color || "").trim())]),
    [colorsObj, rows]
  );
  const byCell = useMemo(() => {
    const map = new Map();
    rows.forEach((r, i) => map.set(cellKey(r.color, r.size), i));
    return map;
  }, [rows]);

  const change = (nextRows, nextColors = colorsObj) => {
    setRows(nextRows);
    setColorsObj(nextColors);
    setDirty(true);
    setSavedNote("");
  };

  const setCell = (color, size, value) => {
    const i = byCell.get(cellKey(color, size));
    if (value === NOT_OFFERED) {
      if (i != null) change(rows.filter((_, j) => j !== i));
      return;
    }
    if (i != null) {
      change(rows.map((r, j) => (j === i ? { ...r, availability: value } : r)));
    } else {
      change([...rows, { size, color, partNumber: "N/A", availability: value }]);
    }
  };

  const setAll = (value) => change(rows.map((r) => ({ ...r, availability: value })));

  const addSize = () => {
    const size = newSize.trim();
    if (!size || sizes.some((s) => norm(s) === norm(size))) return;
    change([...rows, ...colors.map((color) => ({ size, color, partNumber: "N/A", availability: "Out of Stock" }))]);
    setNewSize("");
  };

  const removeSize = (size) => {
    if (!window.confirm(`Remove size ${size} from this bike? (Saved when you press Save stock.)`)) return;
    change(rows.filter((r) => norm(r.size) !== norm(size)));
  };

  const addColor = () => {
    const color = newColor.trim();
    if (!color || colors.some((c) => c.toLowerCase() === color.toLowerCase())) return;
    change(
      [...rows, ...sizes.map((size) => ({ size, color, partNumber: "N/A", availability: "Out of Stock" }))],
      { ...colorsObj, [color]: "" }
    );
    setNewColor("");
  };

  const save = async () => {
    setSaving(true);
    try {
      const colorsChanged = JSON.stringify(colorsObj) !== JSON.stringify(parseColors(bike.colors));
      const newBike = { models: JSON.stringify(rows), ...(colorsChanged && { colors: JSON.stringify(colorsObj) }) };
      await axios.patch(`${apiBase}/api/bikes/other/${bike._id}`, { newBike }, { withCredentials: true });
      invalidateAllBikesCache();
      setDirty(false);
      setSavedNote("Stock saved.");
      onSaved?.();
    } catch {
      alert("Could not save stock. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setRows(parseRows(bike.models));
    setColorsObj(parseColors(bike.colors));
    setDirty(false);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ mb: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Stock
        </Typography>
        {rows.length ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="caption" color="text.secondary">
              Set all to
            </Typography>
            {STOCK_OPTIONS.map((o) => (
              <Button
                key={o.value}
                size="small"
                onClick={() => setAll(o.value)}
                sx={{ minWidth: 0, px: 1, py: 0.25, fontSize: "0.72rem", textTransform: "none", color: o.color, bgcolor: o.bg }}
              >
                {o.label}
              </Button>
            ))}
          </Stack>
        ) : null}
      </Stack>

      {sizes.length && colors.length ? (
        <Box sx={{ overflowX: "auto", border: "1px solid", borderColor: "divider", borderRadius: 1.5 }}>
          <Box component="table" sx={{ borderCollapse: "collapse", minWidth: "100%", fontSize: "0.8rem" }}>
            <thead>
              <tr>
                <Box component="th" sx={{ textAlign: "left", p: 1, bgcolor: "grey.50", position: "sticky", left: 0 }}>
                  Colour
                </Box>
                {sizes.map((size) => (
                  <Box component="th" key={size} sx={{ p: 0.75, bgcolor: "grey.50", whiteSpace: "nowrap", fontWeight: 700 }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.25}>
                      <span>{size}</span>
                      <Tooltip title={`Remove ${size}`}>
                        <IconButton size="small" onClick={() => removeSize(size)} aria-label={`Remove size ${size}`} sx={{ p: 0.25 }}>
                          <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                ))}
              </tr>
            </thead>
            <tbody>
              {colors.map((color) => (
                <tr key={color}>
                  <Box
                    component="th"
                    scope="row"
                    sx={{ textAlign: "left", p: 1, fontWeight: 600, whiteSpace: "nowrap", bgcolor: "#fff", position: "sticky", left: 0, borderTop: "1px solid", borderColor: "divider" }}
                  >
                    {color}
                  </Box>
                  {sizes.map((size) => {
                    const i = byCell.get(cellKey(color, size));
                    const value = i != null ? rows[i].availability : NOT_OFFERED;
                    const opt = optionFor(value);
                    return (
                      <Box component="td" key={size} sx={{ p: 0.5, borderTop: "1px solid", borderColor: "divider", textAlign: "center" }}>
                        <Select
                          size="small"
                          value={opt ? opt.value : i != null ? value || "Out of Stock" : NOT_OFFERED}
                          onChange={(e) => setCell(color, size, e.target.value)}
                          inputProps={{ "aria-label": `${color} ${size} stock` }}
                          sx={{
                            minWidth: 104,
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: opt ? opt.color : "text.disabled",
                            bgcolor: opt ? opt.bg : "transparent",
                            "& .MuiSelect-select": { py: 0.5, px: 1 },
                            "& fieldset": { borderColor: "transparent" },
                          }}
                        >
                          {STOCK_OPTIONS.map((o) => (
                            <MenuItem key={o.value} value={o.value} sx={{ fontSize: "0.85rem" }}>
                              {o.value}
                            </MenuItem>
                          ))}
                          {i != null && !opt ? (
                            <MenuItem value={value} sx={{ fontSize: "0.85rem" }}>
                              {value}
                            </MenuItem>
                          ) : null}
                          <MenuItem value={NOT_OFFERED} sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                            Not offered
                          </MenuItem>
                        </Select>
                      </Box>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {colors.length ? "Add a size to start tracking stock." : "Add a colour and a size to start tracking stock."}
        </Typography>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1.5 }}>
        <Stack direction="row" spacing={0.5}>
          <TextField size="small" label="New size" value={newSize} onChange={(e) => setNewSize(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSize())} sx={{ width: 130 }} />
          <IconButton onClick={addSize} aria-label="Add size" disabled={!newSize.trim()}>
            <AddIcon />
          </IconButton>
        </Stack>
        <Stack direction="row" spacing={0.5}>
          <TextField size="small" label="New colour" value={newColor} onChange={(e) => setNewColor(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())} sx={{ width: 170 }} />
          <IconButton onClick={addColor} aria-label="Add colour" disabled={!newColor.trim()}>
            <AddIcon />
          </IconButton>
        </Stack>
      </Stack>

      {dirty || savedNote ? (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.5 }}>
          {dirty ? (
            <>
              <Button variant="contained" disableElevation onClick={save} disabled={saving} sx={{ bgcolor: NAV_BAR_BG, "&:hover": { bgcolor: "#1e332b" } }}>
                {saving ? "Saving…" : "Save stock"}
              </Button>
              <Button onClick={reset} disabled={saving} sx={{ color: "text.secondary" }}>
                Undo changes
              </Button>
              <Typography variant="caption" color="warning.main">
                Unsaved changes
              </Typography>
            </>
          ) : (
            <Alert severity="success" sx={{ py: 0 }}>
              {savedNote}
            </Alert>
          )}
        </Stack>
      ) : null}
    </Box>
  );
}
