import AddIcon from "@mui/icons-material/Add";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseIcon from "@mui/icons-material/Close";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { Box, Button, Chip, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { invalidateAllBikesCache } from "api/getAllBikesCached";
import { useEffect, useState } from "react";
import { NAV_BAR_BG } from "utils/brandColors";

const apiBase = process.env.REACT_APP_VERCEL_DOMAIN;

function parseRows(raw) {
  try {
    const rows = JSON.parse(raw || "[]");
    return Array.isArray(rows) ? rows.filter((r) => r && typeof r === "object") : [];
  } catch {
    return [];
  }
}

const samePart = (a, b) => a != null && b != null && String(a) === String(b);

/**
 * Vendor stock (from the Transition upload, read-only) plus the shop's own floor stock. Marking a
 * vendor variant "in store", or adding a unit the vendor list doesn't have, saves immediately to
 * the in-store route, so it never touches the upload-owned `models`.
 */
export default function TransitionStockPanel({ bike, modelMatrix, onRefresh }) {
  const [inStore, setInStore] = useState(() => parseRows(bike.inStock));
  const [saving, setSaving] = useState(false);
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");

  useEffect(() => {
    setInStore(parseRows(bike.inStock));
  }, [bike._id, bike.inStock]);

  const save = async (next) => {
    const previous = inStore;
    setInStore(next);
    setSaving(true);
    try {
      await axios.patch(
        `${apiBase}/api/bikes/transition/${bike._id}/in-store`,
        { inStock: next },
        { withCredentials: true }
      );
      invalidateAllBikesCache();
      onRefresh?.();
    } catch {
      setInStore(previous);
      alert("Could not update in-store stock. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const isInStore = (partNumber) => inStore.some((r) => samePart(r.partNumber, partNumber));

  const toggleVendorRow = (color, size, partNumber) => {
    if (isInStore(partNumber)) save(inStore.filter((r) => !samePart(r.partNumber, partNumber)));
    else save([...inStore, { size, color, partNumber, availability: "In Store" }]);
  };

  const removeAt = (index) => save(inStore.filter((_, i) => i !== index));

  const addCustom = () => {
    const color = newColor.trim();
    const size = newSize.trim();
    if (!color || !size) return;
    save([...inStore, { size, color, partNumber: Date.now(), availability: "In Store" }]);
    setNewColor("");
    setNewSize("");
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Transition stock
        </Typography>
        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
          {Object.entries(modelMatrix).map(([colorKey, bySize]) => (
            <Paper key={colorKey} variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
              <Typography variant="caption" fontWeight={700} display="block" gutterBottom>
                {colorKey}
              </Typography>
              <Stack spacing={0.5}>
                {Object.entries(bySize).map(([sizeKey, meta]) => {
                  const marked = isInStore(meta.partNumber);
                  return (
                    <Paper key={`${colorKey}-${sizeKey}`} sx={{ p: 0.75, bgcolor: marked ? "rgba(22,163,74,0.08)" : "grey.50" }}>
                      <Typography variant="caption" display="block">
                        {sizeKey} · {meta.partNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {meta.availability}
                      </Typography>
                      {meta.price != null && meta.price !== "" ? (
                        <Typography variant="caption" color="warning.main" display="block">
                          Own price ${meta.price}
                          {Number(meta.saleprice) > 0 ? ` · Sale $${meta.saleprice}` : ""}
                        </Typography>
                      ) : null}
                      <Button
                        size="small"
                        disabled={saving}
                        onClick={() => toggleVendorRow(colorKey, sizeKey, meta.partNumber)}
                        startIcon={marked ? <CheckRoundedIcon /> : <StorefrontOutlinedIcon />}
                        sx={{
                          mt: 0.5,
                          py: 0,
                          px: 0.75,
                          minWidth: 0,
                          fontSize: "0.72rem",
                          textTransform: "none",
                          color: marked ? "#15803d" : NAV_BAR_BG,
                        }}
                      >
                        {marked ? "In store" : "Mark in store"}
                      </Button>
                    </Paper>
                  );
                })}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          In store now ({inStore.length})
        </Typography>
        {inStore.length ? (
          <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
            {inStore.map((r, i) => (
              <Chip
                key={`${r.partNumber}-${i}`}
                label={`${r.size} · ${r.color}`}
                onDelete={saving ? undefined : () => removeAt(i)}
                deleteIcon={<CloseIcon />}
                sx={{ bgcolor: "rgba(22,163,74,0.1)", color: "#15803d", fontWeight: 600 }}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nothing marked in store. Use &quot;Mark in store&quot; above, or add a unit below.
          </Typography>
        )}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }} sx={{ mt: 1.5 }}>
          <TextField size="small" label="Colour" value={newColor} onChange={(e) => setNewColor(e.target.value)} sx={{ width: 180 }} />
          <TextField size="small" label="Size" value={newSize} onChange={(e) => setNewSize(e.target.value)} sx={{ width: 120 }} />
          <IconButton onClick={addCustom} disabled={saving || !newColor.trim() || !newSize.trim()} aria-label="Add in-store unit">
            <AddIcon />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            For a unit that isn&apos;t on Transition&apos;s list. Its colour needs a photo to show in the shop.
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
