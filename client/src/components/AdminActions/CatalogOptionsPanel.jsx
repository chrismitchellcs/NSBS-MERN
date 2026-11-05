import AddIcon from "@mui/icons-material/Add";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Chip, Collapse, IconButton, Paper, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { saveCatalogOptions, useCatalogOptions } from "api/catalogOptions";
import { useState } from "react";
import { NAV_BAR_BG } from "utils/brandColors";

const sameText = (a, b) => String(a).trim().toLowerCase() === String(b).trim().toLowerCase();

/** One editable list: add, remove, and (for ordered lists) move entries left / right. */
function OptionList({ title, help, items, ordered, placeholder, onChange, saving }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    if (saving) return;
    const text = draft.replace(/\s+/g, " ").trim();
    if (!text || items.some((i) => sameText(i, text))) {
      setDraft("");
      return;
    }
    onChange([...items, text]);
    setDraft("");
  };

  const move = (index, step) => {
    if (saving) return;
    const next = [...items];
    const target = index + step;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="subtitle2" fontWeight={700}>
        {title} ({items.length})
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
        {help}
      </Typography>
      <Stack direction="row" flexWrap="wrap" useFlexGap gap={0.75} sx={{ mb: 1.5 }}>
        {items.map((item, i) => (
          <Chip
            key={item}
            disabled={saving}
            label={
              ordered ? (
                <Stack direction="row" alignItems="center" spacing={0.25}>
                  <IconButton size="small" aria-label={`Move ${item} earlier`} onClick={() => move(i, -1)} disabled={i === 0} sx={{ p: 0 }}>
                    <ChevronLeftRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <span>{item}</span>
                  <IconButton size="small" aria-label={`Move ${item} later`} onClick={() => move(i, 1)} disabled={i === items.length - 1} sx={{ p: 0 }}>
                    <ChevronRightRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Stack>
              ) : (
                item
              )
            }
            onDelete={() => {
              if (window.confirm(`Remove "${item}" from the ${title.toLowerCase()} list? Bikes that already use it keep it.`)) {
                onChange(items.filter((x) => x !== item));
              }
            }}
            deleteIcon={<CloseIcon />}
            sx={{ fontWeight: 600, bgcolor: "#fff", border: "1px solid", borderColor: "divider" }}
          />
        ))}
      </Stack>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <TextField
          size="small"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          inputProps={{ maxLength: 60 }}
          sx={{ width: 220 }}
        />
        <Tooltip title={`Add ${title.toLowerCase().replace(/s$/, "")}`}>
          <span>
            <IconButton onClick={add} disabled={saving || !draft.trim()} aria-label={`Add to ${title}`}>
              <AddIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Box>
  );
}

/** Shop-wide brands and sizes offered when adding or editing a bike. */
export default function CatalogOptionsPanel() {
  const { brands, sizes } = useCatalogOptions();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async (patch) => {
    setSaving(true);
    try {
      await saveCatalogOptions(patch);
    } catch {
      alert("Could not save. Check you're still logged in and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: NAV_BAR_BG }}>
            Brands &amp; sizes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The choices offered when you add a bike or edit its brand and sizes.
          </Typography>
        </Box>
        <Button
          onClick={() => setOpen((v) => !v)}
          endIcon={<ExpandMoreIcon sx={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }} />}
          sx={{ color: NAV_BAR_BG, flexShrink: 0 }}
        >
          {open ? "Close" : "Manage"}
        </Button>
      </Stack>
      <Collapse in={open} unmountOnExit>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mt: 2.5 }}>
          <OptionList
            title="Brands"
            help="Each brand gets its own section in the list below."
            items={brands}
            placeholder="e.g. Dorco"
            onChange={(next) => save({ brands: next })}
            saving={saving}
          />
          <OptionList
            title="Sizes"
            help="Any text works (e.g. S2, 29&quot;). Order them smallest to largest with the arrows."
            items={sizes}
            ordered
            placeholder={'e.g. S3 or 27.5"'}
            onChange={(next) => save({ sizes: next })}
            saving={saving}
          />
        </Stack>
      </Collapse>
    </Paper>
  );
}
