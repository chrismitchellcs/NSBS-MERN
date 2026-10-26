import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { AdminBikeColorImageBlock } from "components/AdminActions/AdminBikeColorImageBlock";
import AddSizes from "components/AdminActions/AddSizes";
import OtherBikeStockGrid, { STOCK_OPTIONS, stockSummary } from "components/AdminActions/OtherBikeStockGrid";
import { NAV_BAR_BG } from "utils/brandColors";
import { transitionBikeIssues, transitionBikesNeedingAttention } from "utils/transitionAdminChecks";
import { invalidateAllBikesCache } from "api/getAllBikesCached";
import axios from "axios";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { bikePhotoPublicId, isCloudinaryUrl } from "utils/bikeDisplay";

const apiBase = process.env.REACT_APP_VERCEL_DOMAIN;

const VisuallyHiddenFileInput = (props) => (
  <input
    {...props}
    style={{
      clip: "rect(0 0 0 0)",
      clipPath: "inset(50%)",
      height: 1,
      overflow: "hidden",
      position: "absolute",
      bottom: 0,
      left: 0,
      whiteSpace: "nowrap",
      width: 1,
    }}
  />
);

/**
 * Upload during draft create. Reads bike naming from `publicIdBaseRef` only when saving — avoids re-rendering every row on each keystroke.
 * @param {{ colorName: string, imageUrl: string, patchColorUrl: (color: string, url: string) => void, publicIdBaseRef: import("react").MutableRefObject<string> }} props
 */
function DraftColorImageBlockInner(props) {
  const { colorName, imageUrl, patchColorUrl, publicIdBaseRef } = props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Choose an image first.");
      return;
    }
    const base = (publicIdBaseRef.current || "").trim();
    if (!base) {
      alert("Enter year, brand, and bike name first (above). Then save the photo to Cloudinary.");
      return;
    }
    const fileName = bikePhotoPublicId(base, colorName);
    setUploading(true);
    try {
      const sigRes = await axios.get(`${apiBase}/api/images/get-signature`, {
        params: { public_id: fileName },
        withCredentials: true,
      });
      const sigData = sigRes.data;
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp);
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);
      formData.append("public_id", fileName);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`;
      const uploadRes = await axios.post(cloudinaryUrl, formData, { withCredentials: false });
      const secureUrl = uploadRes.data.secure_url;
      patchColorUrl(colorName, secureUrl);
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageUrl) return;
    if (
      !window.confirm(
        `Remove this photo from the form and delete it from Cloudinary (if stored there)?`
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      if (isCloudinaryUrl(imageUrl)) {
        await axios.post(`${apiBase}/api/images/destroy`, { secure_url: imageUrl }, { withCredentials: true });
      }
      patchColorUrl(colorName, "");
    } catch (e) {
      console.error(e);
      alert("Could not remove the image. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 280 }}>
      <Box
        sx={{
          borderRadius: 1,
          overflow: "hidden",
          bgcolor: "grey.100",
          aspectRatio: "4/3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 120,
        }}
      >
        {previewUrl ? (
          <Box
            component="img"
            src={previewUrl}
            alt=""
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt=""
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <Typography variant="caption" color="text.secondary" sx={{ px: 1, textAlign: "center" }}>
            No photo yet
          </Typography>
        )}
      </Box>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
        <Button size="small" component="label" variant="outlined" startIcon={<PhotoCameraOutlinedIcon />}>
          {imageUrl ? "Replace" : "Upload"}
          <VisuallyHiddenFileInput type="file" accept="image/*" onChange={handleFileChange} />
        </Button>
        {selectedFile && (
          <Button size="small" variant="contained" onClick={handleUpload} disabled={uploading} sx={{ bgcolor: NAV_BAR_BG }}>
            {uploading ? "…" : "Save to Cloudinary"}
          </Button>
        )}
        {imageUrl ? (
          <IconButton
            size="small"
            color="error"
            onClick={handleDelete}
            disabled={deleting || uploading}
            aria-label={`Delete ${colorName} image`}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        ) : null}
      </Stack>
    </Box>
  );
}

const DraftColorImageBlock = memo(DraftColorImageBlockInner);

function AddColorsForm({ colors, setColors, colorImages, setColorImages, publicIdBaseRef, patchColorUrl }) {
  const [currentColor, setCurrentColor] = useState("");

  const removeColor = async (color) => {
    const url = colorImages[color];
    if (url && isCloudinaryUrl(url)) {
      try {
        await axios.post(`${apiBase}/api/images/destroy`, { secure_url: url }, { withCredentials: true });
      } catch (e) {
        console.error(e);
      }
    }
    setColorImages((prev) => {
      const next = { ...prev };
      delete next[color];
      return next;
    });
    setColors((prev) => prev.filter((c) => c !== color));
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, width: "100%", maxWidth: 640 }}>
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
        Colours & photos
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        Add each colour, then upload a photo. Fill in <strong>year</strong>, <strong>brand</strong>, and <strong>name</strong> above first so Cloudinary
        file names match this bike (same as when editing later).
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }} flexWrap="wrap" useFlexGap>
        <TextField
          size="small"
          value={currentColor}
          label="Colour name"
          onChange={(e) => setCurrentColor(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <Button
          variant="contained"
          sx={{ bgcolor: NAV_BAR_BG }}
          onClick={() => {
            const t = currentColor.trim();
            if (!t || colors.includes(t)) return;
            setColors([...colors, t]);
            setColorImages((prev) => ({ ...prev, [t]: "" }));
            setCurrentColor("");
          }}
        >
          Add colour
        </Button>
      </Stack>
      <Stack spacing={0} sx={{ mt: 2 }}>
        {colors.map((color) => (
          <Paper key={color} variant="outlined" sx={{ p: 1.5, mt: 1.5, borderRadius: 2, bgcolor: "grey.50" }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography variant="subtitle2" fontWeight={700}>
                {color}
              </Typography>
              <IconButton aria-label={`Remove ${color}`} size="small" color="error" onClick={() => removeColor(color)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
            <DraftColorImageBlock
              colorName={color}
              imageUrl={colorImages[color] || ""}
              patchColorUrl={patchColorUrl}
              publicIdBaseRef={publicIdBaseRef}
            />
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}

const BIKE_TYPES = [
  "DH",
  "Enduro / All Mountain",
  "Trail",
  "XC",
  "Dirt Jumper",
  "Recreational",
  "Kids",
  "E-Bike",
  "Frameset",
];

function parseJson(raw, fallback) {
  try {
    const v = JSON.parse(raw || "null");
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

/** Small Cloudinary thumbnail for list rows (falls back to the original URL). */
function thumbUrl(url) {
  return isCloudinaryUrl(url) ? url.replace("/upload/", "/upload/w_160,h_100,c_pad,b_white,q_auto,f_auto/") : url;
}

const bikeElementId = (id) => `other-bike-${id}`;

function OtherBikeEditor({ bike, onRefresh, expanded, onToggle }) {
  const colors = useMemo(() => {
    const obj = parseJson(bike.colors, {});
    return obj && typeof obj === "object" && !Array.isArray(obj) ? obj : {};
  }, [bike.colors]);
  const firstPhoto = Object.values(colors).find((u) => typeof u === "string" && u.trim());
  const issues = useMemo(() => transitionBikeIssues(bike), [bike]);

  const [isPublic, setIsPublic] = useState(bike.public);
  const [isArchived, setIsArchived] = useState(Boolean(bike.archived));
  const [edit, setEdit] = useState(false);
  const [editType, setEditType] = useState(bike.type);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(bike.name || "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setIsPublic(bike.public);
    setIsArchived(Boolean(bike.archived));
    setEditType(bike.type);
    setRenameValue(bike.name || "");
  }, [bike._id, bike.archived, bike.public, bike.type, bike.name]);

  const patch = (newBike) =>
    axios.patch(`${apiBase}/api/bikes/other/${bike._id}`, { newBike }, { withCredentials: true });

  const handlePublicChange = async (event) => {
    const checked = event.target.checked;
    if (
      checked &&
      !firstPhoto &&
      !window.confirm(
        "This bike has no photos, so it won't appear in the shop until you add one. Make it public anyway?"
      )
    ) {
      return;
    }
    setIsPublic(checked);
    try {
      await patch({ public: checked });
      invalidateAllBikesCache();
      onRefresh();
    } catch {
      alert("Could not update visibility.");
      setIsPublic(!checked);
    }
  };

  const handleArchivedChange = async (event) => {
    const checked = event.target.checked;
    setIsArchived(checked);
    const newBike = { archived: checked };
    if (checked) {
      newBike.public = false;
      setIsPublic(false);
    }
    try {
      await patch(newBike);
      invalidateAllBikesCache();
      onRefresh();
    } catch {
      alert("Could not update archive state.");
      setIsArchived(!checked);
      if (checked) setIsPublic(bike.public);
    }
  };

  const handleEditDetailsSubmit = async (e) => {
    e.preventDefault();
    const description = e.target.description.value;
    const link = e.target.link.value;
    const year = e.target.year.value.trim();
    const price = e.target.price.value;
    const saleprice = e.target.saleprice.value;
    const costRaw = (e.target.costPrice?.value ?? "").trim();
    let costPrice = bike.costPrice;
    if (costRaw === "") costPrice = null;
    else {
      const n = Number(costRaw);
      if (Number.isFinite(n) && n >= 0) costPrice = n;
    }
    // fullName drives Cloudinary file names, so it follows the year like a rename does.
    const fullName = `${year} ${bike.brand ?? ""} ${bike.name ?? ""}`.replace(/\s+/g, " ").trim();
    const newBike = { type: editType, description, link, year, price, saleprice, costPrice, fullName };
    try {
      await patch(newBike);
      invalidateAllBikesCache();
      onRefresh();
      setEdit(false);
    } catch {
      alert("Could not save details.");
    }
  };

  const handleRenameSave = async () => {
    const next = renameValue.trim();
    if (!next) {
      alert("Name cannot be empty.");
      return;
    }
    const fullName = `${bike.year ?? ""} ${bike.brand ?? ""} ${next}`.replace(/\s+/g, " ").trim();
    try {
      await patch({ name: next, fullName });
      invalidateAllBikesCache();
      setRenameOpen(false);
      onRefresh();
    } catch {
      alert("Could not update name.");
    }
  };

  const handleDeleteBike = async () => {
    if (
      !window.confirm(
        `Delete “${bike.name}” permanently?\n\nThis removes the listing from the database and deletes associated Cloudinary images. This cannot be undone.`
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      await axios.delete(`${apiBase}/api/bikes/other/${bike._id}`, { withCredentials: true });
      invalidateAllBikesCache();
      onRefresh();
    } catch (e) {
      console.error(e);
      alert("Could not delete this bike. Try again or check that you’re logged in.");
    } finally {
      setDeleting(false);
    }
  };

  const hasSale = Number(bike.saleprice) > 0;
  const summary = stockSummary(bike.models);

  const editForm = (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, maxWidth: 440 }}>
      <form onSubmit={handleEditDetailsSubmit}>
        <Stack spacing={2}>
          <FormControl size="small" fullWidth>
            <InputLabel id={`type-${bike._id}`}>Bike type</InputLabel>
            <Select labelId={`type-${bike._id}`} label="Bike type" value={editType || ""} onChange={(e) => setEditType(e.target.value)}>
              {BIKE_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField name="description" label="Description" defaultValue={bike.description} multiline minRows={3} fullWidth size="small" />
          <TextField name="link" label="Link" defaultValue={bike.link} fullWidth size="small" />
          <TextField name="year" label="Year" defaultValue={bike.year} fullWidth size="small" />
          <Stack direction="row" spacing={1}>
            <TextField name="price" label="Price" defaultValue={bike.price} fullWidth size="small" type="number" />
            <TextField name="saleprice" label="Sale price" defaultValue={bike.saleprice ?? ""} fullWidth size="small" type="number" />
          </Stack>
          <TextField
            name="costPrice"
            label="Cost"
            defaultValue={bike.costPrice ?? ""}
            fullWidth
            size="small"
            type="number"
            inputProps={{ min: 0, step: "any" }}
            helperText="Admin only. Leave blank to clear."
          />
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained" disableElevation sx={{ bgcolor: NAV_BAR_BG }}>
              Save details
            </Button>
            <Button type="button" variant="text" onClick={() => setEdit(false)}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );

  return (
    <Card id={bikeElementId(bike._id)} variant="outlined" sx={{ borderRadius: 2, overflow: "visible", scrollMarginTop: OTHER_BIKES_LIST_SCROLL_MARGIN }}>
      <Box
        component="button"
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        sx={{
          all: "unset",
          boxSizing: "border-box",
          width: "100%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 1.25,
          borderRadius: 2,
          "&:hover": { bgcolor: "action.hover" },
          "&:focus-visible": { outline: `2px solid ${NAV_BAR_BG}`, outlineOffset: -2 },
        }}
      >
        <Box sx={{ width: 80, height: 50, flexShrink: 0, borderRadius: 1, bgcolor: "grey.100", overflow: "hidden", display: "grid", placeItems: "center" }}>
          {firstPhoto ? (
            <Box component="img" src={thumbUrl(firstPhoto)} alt="" loading="lazy" sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            <PhotoCameraOutlinedIcon sx={{ color: "text.disabled" }} fontSize="small" />
          )}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography fontWeight={700} sx={{ color: NAV_BAR_BG, lineHeight: 1.2 }} noWrap>
            {bike.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" component="div" noWrap>
            {[bike.brand, bike.year, bike.type].filter(Boolean).join(" · ")}
            {summary ? ` · ${summary}` : ""}
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexShrink: 0 }}>
          {issues.length ? (
            <Chip size="small" color="warning" variant="outlined" label={`${issues.length} to fix`} />
          ) : null}
          <Chip
            size="small"
            label={isArchived ? "Archived" : isPublic ? "Public" : "Private"}
            sx={{
              fontWeight: 600,
              bgcolor: isArchived ? "grey.200" : isPublic ? "rgba(22,163,74,0.12)" : "rgba(0,0,0,0.06)",
              color: isArchived ? "text.secondary" : isPublic ? "#15803d" : "text.primary",
            }}
          />
          <Typography variant="body2" fontWeight={700} sx={{ minWidth: 72, textAlign: "right", display: { xs: "none", sm: "block" } }}>
            {hasSale ? (
              <>
                <Box component="span" sx={{ textDecoration: "line-through", color: "text.secondary", fontWeight: 400, mr: 0.5 }}>
                  ${bike.price}
                </Box>
                ${bike.saleprice}
              </>
            ) : bike.price ? (
              `$${bike.price}`
            ) : (
              "No price"
            )}
          </Typography>
          <ExpandMoreIcon sx={{ transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none", color: "text.secondary" }} />
        </Stack>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 1, "&:last-child": { pb: 2 } }}>
          <Dialog open={renameOpen} onClose={() => setRenameOpen(false)} fullWidth maxWidth="xs">
            <DialogTitle>Edit bike name</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Name (without brand or year)"
                fullWidth
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                helperText={`Full name: ${bike.year ?? ""} ${bike.brand ?? ""} ${renameValue.trim() || "…"}`.replace(/\s+/g, " ").trim()}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
              <Button onClick={handleRenameSave} variant="contained" sx={{ bgcolor: NAV_BAR_BG }}>
                Save name
              </Button>
            </DialogActions>
          </Dialog>

          {issues.length ? (
            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.75} sx={{ mb: 2 }}>
              {issues.map((issue) => (
                <Chip
                  key={issue.key}
                  size="small"
                  label={issue.label}
                  color={issue.severity === "high" ? "error" : issue.severity === "medium" ? "warning" : "default"}
                  variant="outlined"
                />
              ))}
            </Stack>
          ) : null}

          <Stack
            direction="row"
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
            spacing={2}
            sx={{ py: 0.5, px: 1, mb: 2, borderRadius: 1, bgcolor: "action.hover" }}
          >
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography variant="body2" fontWeight={600}>
                {isPublic ? "Public" : "Private"}
              </Typography>
              <Switch checked={isPublic} onChange={handlePublicChange} color="success" size="small" />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography variant="body2" fontWeight={600}>
                Archived
              </Typography>
              <Switch checked={isArchived} onChange={handleArchivedChange} color="warning" size="small" />
            </Stack>
            <Box sx={{ flex: 1 }} />
            <Button
              size="small"
              startIcon={<DriveFileRenameOutlineIcon />}
              onClick={() => {
                setRenameValue(bike.name || "");
                setRenameOpen(true);
              }}
              sx={{ color: NAV_BAR_BG }}
            >
              Edit name
            </Button>
            <Button size="small" color="error" startIcon={<DeleteOutlineIcon />} disabled={deleting} onClick={handleDeleteBike}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </Stack>

          <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems={{ xs: "stretch", lg: "flex-start" }}>
            <Stack spacing={2} flex={{ xs: 1, lg: 1.4 }} minWidth={0}>
              <OtherBikeStockGrid bike={bike} onSaved={onRefresh} />
              <Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Details
                  </Typography>
                  {!edit ? (
                    <Button
                      size="small"
                      startIcon={<EditOutlinedIcon />}
                      onClick={() => {
                        setEditType(bike.type);
                        setEdit(true);
                      }}
                      sx={{ color: NAV_BAR_BG }}
                    >
                      Edit details
                    </Button>
                  ) : null}
                </Stack>
                {edit ? (
                  editForm
                ) : (
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 2, rowGap: 0.75, fontSize: "0.875rem" }}>
                      <strong>Type</strong>
                      <span>{bike.type || "—"}</span>
                      <strong>Year</strong>
                      <span>{bike.year || "—"}</span>
                      <strong>Price</strong>
                      <span>{bike.price ? `$${bike.price}` : "—"}</span>
                      <strong>Sale</strong>
                      <span>{hasSale ? `$${bike.saleprice}` : "—"}</span>
                      <strong>Cost</strong>
                      <span>{bike.costPrice != null && bike.costPrice !== "" ? `$${bike.costPrice}` : "—"}</span>
                      <strong>Link</strong>
                      <Box component="span" sx={{ wordBreak: "break-all" }}>
                        {bike.link || "—"}
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1.5, color: bike.description ? "text.primary" : "text.secondary" }}>
                      {bike.description || "No description yet."}
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Stack>

            <Stack spacing={1.5} flex={{ xs: 1, lg: 1 }} minWidth={0} width="100%">
              <Typography variant="subtitle2" fontWeight={700}>
                Photos by colour
              </Typography>
              <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1.5}>
                {Object.keys(colors).length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No colours on this bike yet. Add one in the stock grid.
                  </Typography>
                ) : (
                  Object.entries(colors).map(([colorName, url]) => (
                    <AdminBikeColorImageBlock
                      key={colorName}
                      bike={bike}
                      colorName={colorName}
                      imageUrl={url}
                      onRefresh={onRefresh}
                      bikeRoute="other"
                    />
                  ))
                )}
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
}

const OTHER_BIKES_LIST_SCROLL_MARGIN = 96;

const OTHER_BIKE_BRAND_SECTION_IDS = {
  transition: "other-bikes-brand-transition",
  norco: "other-bikes-brand-norco",
  ibis: "other-bikes-brand-ibis",
  other: "other-bikes-brand-other",
};

function scrollToElement(elementId) {
  document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function OtherBikesBrandNav({ counts }) {
  const items = [
    { id: OTHER_BIKE_BRAND_SECTION_IDS.transition, label: "Transition", count: counts.transition },
    { id: OTHER_BIKE_BRAND_SECTION_IDS.norco, label: "Norco", count: counts.norco },
    { id: OTHER_BIKE_BRAND_SECTION_IDS.ibis, label: "Ibis", count: counts.ibis },
    ...(counts.other ? [{ id: OTHER_BIKE_BRAND_SECTION_IDS.other, label: "Other", count: counts.other }] : []),
  ];

  return (
    <Box
      component="nav"
      aria-label="Jump to brand"
      sx={{
        display: "flex",
        flexDirection: { xs: "row", md: "column" },
        flexWrap: { xs: "wrap", md: "nowrap" },
        gap: 1,
        position: "sticky",
        top: { xs: 72, md: 96 },
        zIndex: 8,
        alignSelf: { xs: "stretch", md: "flex-start" },
        width: { xs: "100%", md: 168 },
        flexShrink: 0,
        py: { xs: 1, md: 0 },
        bgcolor: { xs: "rgba(255,255,255,0.92)", md: "transparent" },
        backdropFilter: { xs: "blur(8px)", md: "none" },
        borderBottom: { xs: 1, md: 0 },
        borderColor: "divider",
      }}
    >
      {items.map(({ id, label, count }) => (
        <Button
          key={id}
          type="button"
          variant="outlined"
          size="small"
          onClick={() => scrollToElement(id)}
          sx={{
            borderColor: NAV_BAR_BG,
            color: NAV_BAR_BG,
            textTransform: "none",
            justifyContent: { xs: "center", md: "flex-start" },
            fontSize: { xs: "0.75rem", md: "0.8125rem" },
            py: { xs: 0.5, md: 0.75 },
            px: { xs: 1, md: 1.25 },
            flex: { xs: "1 1 auto", md: "0 0 auto" },
            minWidth: { xs: 0, md: "100%" },
          }}
        >
          {`${label} (${count})`}
        </Button>
      ))}
    </Box>
  );
}

function OtherBikesBrandSection({ id, title, bikes, onRefresh, expandedIds, toggle }) {
  return (
    <Box id={id} sx={{ scrollMarginTop: OTHER_BIKES_LIST_SCROLL_MARGIN }}>
      <Typography variant="h6" fontWeight={800} sx={{ color: NAV_BAR_BG, mb: 1.5 }}>
        {title}{" "}
        <Typography component="span" color="text.secondary" fontWeight={500}>
          ({bikes.length})
        </Typography>
      </Typography>
      {bikes.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
          No bikes here.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {bikes.map((bike) => (
            <OtherBikeEditor
              key={bike._id}
              bike={bike}
              onRefresh={onRefresh}
              expanded={expandedIds.has(bike._id)}
              onToggle={() => toggle(bike._id)}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

/** Bikes with problems (missing photos, no description / type, stock with nothing public…). */
function OtherBikesNeedAttention({ bikes, onOpen }) {
  const [showAll, setShowAll] = useState(false);
  const flagged = useMemo(() => transitionBikesNeedingAttention(bikes), [bikes]);
  if (!flagged.length) {
    return (
      <Alert severity="success" variant="outlined">
        Nothing needs attention right now.
      </Alert>
    );
  }
  const visible = showAll ? flagged : flagged.slice(0, 6);
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: "warning.light", bgcolor: "rgba(237,108,2,0.03)" }}>
      <Typography variant="subtitle1" fontWeight={800} sx={{ color: NAV_BAR_BG, mb: 1 }}>
        Needs attention ({flagged.length})
      </Typography>
      <Stack spacing={0.75}>
        {visible.map(({ bike, issues }) => (
          <Stack key={bike._id} direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} spacing={1}>
            <Typography variant="body2" fontWeight={700} sx={{ minWidth: 220 }}>
              {[bike.brand, bike.name].filter(Boolean).join(" ")}
              {!bike.public ? (
                <Typography component="span" variant="caption" color="text.secondary">
                  {" "}
                  (private)
                </Typography>
              ) : null}
            </Typography>
            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.5} sx={{ flex: 1 }}>
              {issues.map((issue) => (
                <Chip
                  key={issue.key}
                  size="small"
                  label={issue.label}
                  color={issue.severity === "high" ? "error" : issue.severity === "medium" ? "warning" : "default"}
                  variant="outlined"
                />
              ))}
            </Stack>
            <Button size="small" onClick={() => onOpen(bike._id)} sx={{ color: NAV_BAR_BG, flexShrink: 0 }}>
              Open
            </Button>
          </Stack>
        ))}
      </Stack>
      {flagged.length > 6 ? (
        <Button size="small" onClick={() => setShowAll((v) => !v)} sx={{ mt: 1, color: "text.secondary" }}>
          {showAll ? "Show fewer" : `Show all ${flagged.length}`}
        </Button>
      ) : null}
    </Paper>
  );
}

function partitionOtherBikesByBrand(bikeList) {
  const transition = [];
  const norco = [];
  const ibis = [];
  const other = [];
  bikeList.forEach((b) => {
    const k = String(b.brand ?? "").trim().toLowerCase();
    if (k === "transition") transition.push(b);
    else if (k === "norco") norco.push(b);
    else if (k === "ibis") ibis.push(b);
    else other.push(b);
  });
  return { transition, norco, ibis, other };
}

function sortBikesForOtherList(arr, listSort) {
  const nameKey = (b) => String(b.name ?? b.fullName ?? "").toLowerCase();
  return [...arr].sort((a, b) => {
    if (listSort === "public-first" || listSort === "private-first") {
      if (a.public !== b.public) {
        if (listSort === "public-first") return a.public ? -1 : 1;
        return a.public ? 1 : -1;
      }
    }
    return nameKey(a).localeCompare(nameKey(b));
  });
}

const AddNewBike = () => {
  const [open, setOpen] = useState(false);
  const [bikes, setBikes] = useState([]);
  const [sizeArray, setSizeArray] = useState([]);
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [colors, setColors] = useState([]);
  const [draftYear, setDraftYear] = useState("");
  const [draftBikeName, setDraftBikeName] = useState("");
  /** colour name → Cloudinary URL (empty string = no image yet) */
  const [colorImages, setColorImages] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const publicIdBaseRef = useRef("");
  publicIdBaseRef.current = `${draftYear} ${brand} ${draftBikeName}`.replace(/\s+/g, " ").trim();

  const patchColorUrl = useCallback((color, url) => {
    setColorImages((prev) => ({ ...prev, [color]: url }));
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const fetchBikes = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/bikes/other`, { withCredentials: true });
      setBikes(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const toggle = useCallback((id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const [listVisibility, setListVisibility] = useState("all");
  const [listSort, setListSort] = useState("name-asc");

  /** From "Needs attention": clear filters so the bike is listed, expand it, and scroll to it. */
  const openBike = (id) => {
    setSearch("");
    setListVisibility("all");
    setExpandedIds((prev) => new Set(prev).add(id));
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToElement(bikeElementId(id))));
  };

  const filteredBikes = useMemo(() => {
    let arr = Array.isArray(bikes) ? [...bikes] : [];
    if (listVisibility === "public") arr = arr.filter((b) => b.public && !b.archived);
    if (listVisibility === "private") arr = arr.filter((b) => !b.public && !b.archived);
    if (listVisibility === "archived") arr = arr.filter((b) => b.archived);
    const q = search.trim().toLowerCase();
    if (q) {
      arr = arr.filter((b) =>
        [b.brand, b.name, b.fullName, b.type, b.year].filter(Boolean).join(" ").toLowerCase().includes(q)
      );
    }
    return arr;
  }, [bikes, listVisibility, search]);

  const bikesByBrand = useMemo(() => {
    const { transition, norco, ibis, other } = partitionOtherBikesByBrand(filteredBikes);
    return {
      transition: sortBikesForOtherList(transition, listSort),
      norco: sortBikesForOtherList(norco, listSort),
      ibis: sortBikesForOtherList(ibis, listSort),
      other: sortBikesForOtherList(other, listSort),
    };
  }, [filteredBikes, listSort]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const year = draftYear.trim();
    const name = draftBikeName.trim();
    const price = event.target.price.value;
    const saleprice = event.target.saleprice.value;
    const costPrice = event.target.costPrice?.value?.trim() ?? "";
    const description = event.target.description.value;
    const link = event.target.link.value;
    const fullName = `${year} ${brand} ${name}`.replace(/\s+/g, " ").trim();
    const initialStock = event.target.initialStock?.value || "Out of Stock";

    const availabilityArray = [];
    const colorObject = {};
    colors.forEach((c) => {
      colorObject[c] = colorImages[c] || "";
    });
    sizeArray.forEach((size) => {
      colors.forEach((color) => {
        availabilityArray.push({
          size,
          color,
          partNumber: "N/A",
          availability: initialStock,
        });
      });
    });

    try {
      await axios.post(
        `${apiBase}/api/bikes/other`,
        {
          brand,
          type,
          year,
          name,
          price,
          saleprice,
          ...(costPrice !== "" ? { costPrice } : {}),
          description,
          link,
          fullName,
          models: JSON.stringify(availabilityArray),
          colors: JSON.stringify(colorObject),
          public: false,
        },
        { withCredentials: true }
      );
      await fetchBikes();
      invalidateAllBikesCache();
      setOpen(true);
      event.target.reset();
      setBrand("");
      setType("");
      setColors([]);
      setSizeArray([]);
      setDraftYear("");
      setDraftBikeName("");
      setColorImages({});
      setShowAddForm(false);
    } catch {
      alert("Bike not added.");
    }
  };

  const brandCounts = {
    transition: bikesByBrand.transition.length,
    norco: bikesByBrand.norco.length,
    ibis: bikesByBrand.ibis.length,
    other: bikesByBrand.other.length,
  };

  return (
    <Stack spacing={3} sx={{ width: "100%", maxWidth: 1280, mx: "auto", px: { xs: 1, sm: 2 }, py: 2 }}>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleClose} severity="success" variant="filled">
          Bike added as a private draft. Set its stock and go public when it&apos;s ready.
        </Alert>
      </Snackbar>

      <OtherBikesNeedAttention bikes={bikes} onOpen={openBike} />

      <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: NAV_BAR_BG }}>
              Add a bike
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Norco, Ibis, or any bike that isn&apos;t on the Transition stock list.
            </Typography>
          </Box>
          <Button
            variant={showAddForm ? "text" : "contained"}
            disableElevation
            startIcon={showAddForm ? <CloseIcon /> : <AddIcon />}
            onClick={() => setShowAddForm((v) => !v)}
            sx={showAddForm ? { color: "text.secondary" } : { bgcolor: NAV_BAR_BG, "&:hover": { bgcolor: "#1e332b" } }}
          >
            {showAddForm ? "Close" : "Add a bike"}
          </Button>
        </Stack>
        <Collapse in={showAddForm} unmountOnExit>
          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              const el = e.target;
              if (e.key === "Enter" && el instanceof HTMLElement && el.tagName !== "TEXTAREA") {
                e.preventDefault();
              }
            }}
          >
            <Stack spacing={2} sx={{ maxWidth: 560, mt: 2.5 }}>
              <FormLabel>Brand</FormLabel>
              <RadioGroup row value={brand} onChange={(e) => setBrand(e.target.value)} name="brand">
                <FormControlLabel value="Norco" control={<Radio size="small" />} label="Norco" />
                <FormControlLabel value="Ibis" control={<Radio size="small" />} label="Ibis" />
                <FormControlLabel value="Transition" control={<Radio size="small" />} label="Transition" />
                <FormControlLabel value="other" control={<Radio size="small" />} label="Other" />
              </RadioGroup>
              <FormControl size="small" fullWidth required>
                <InputLabel id="new-bike-type">Bike type</InputLabel>
                <Select labelId="new-bike-type" label="Bike type" value={type} onChange={(e) => setType(e.target.value)}>
                  {BIKE_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Stack direction="row" spacing={1}>
                <TextField name="year" label="Year" required size="small" value={draftYear} onChange={(e) => setDraftYear(e.target.value)} sx={{ width: 120 }} />
                <TextField name="name" label="Name (without brand)" required fullWidth size="small" value={draftBikeName} onChange={(e) => setDraftBikeName(e.target.value)} />
              </Stack>
              <Stack direction="row" spacing={1}>
                <TextField name="price" label="Price" required fullWidth size="small" type="number" />
                <TextField name="saleprice" label="Sale price (optional)" fullWidth size="small" type="number" />
              </Stack>
              <TextField name="costPrice" label="Cost (optional, admin only)" fullWidth size="small" type="number" inputProps={{ min: 0, step: "any" }} />
              <TextField name="description" label="Description" multiline minRows={3} fullWidth size="small" />
              <TextField name="link" label="Link to the brand's page" fullWidth size="small" />
              <FormLabel>Sizes (smallest → largest)</FormLabel>
              <AddSizes sizes={sizeArray} setSizes={setSizeArray} />
              <AddColorsForm
                colors={colors}
                setColors={setColors}
                colorImages={colorImages}
                setColorImages={setColorImages}
                publicIdBaseRef={publicIdBaseRef}
                patchColorUrl={patchColorUrl}
              />
              <FormControl size="small" sx={{ maxWidth: 280 }}>
                <InputLabel id="new-bike-stock">Starting stock for every size / colour</InputLabel>
                <Select labelId="new-bike-stock" label="Starting stock for every size / colour" name="initialStock" defaultValue="Available to Order">
                  {STOCK_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" disableElevation sx={{ bgcolor: NAV_BAR_BG, alignSelf: "flex-start" }}>
                Add bike
              </Button>
            </Stack>
          </form>
        </Collapse>
      </Paper>

      <Box>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} useFlexGap sx={{ mb: 2, alignItems: { md: "center" } }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: NAV_BAR_BG, flex: 1 }}>
            Bikes ({filteredBikes.length})
          </Typography>
          <TextField
            size="small"
            placeholder="Search by name, brand, type, year"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: { md: 280 } }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="other-bikes-visibility">Show</InputLabel>
            <Select labelId="other-bikes-visibility" label="Show" value={listVisibility} onChange={(e) => setListVisibility(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private drafts</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="other-bikes-sort">Sort</InputLabel>
            <Select labelId="other-bikes-sort" label="Sort" value={listSort} onChange={(e) => setListSort(e.target.value)}>
              <MenuItem value="name-asc">Name A–Z</MenuItem>
              <MenuItem value="public-first">Public first</MenuItem>
              <MenuItem value="private-first">Private first</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        {!bikes?.length ? (
          <Typography color="text.secondary">No bikes in this list yet.</Typography>
        ) : filteredBikes.length === 0 ? (
          <Typography color="text.secondary">No bikes match.</Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 1, md: 3 },
              width: "100%",
              alignItems: { xs: "stretch", md: "flex-start" },
            }}
          >
            <OtherBikesBrandNav counts={brandCounts} />
            <Stack spacing={4} sx={{ flex: 1, minWidth: 0 }}>
              {[
                ["norco", "Norco"],
                ["ibis", "Ibis"],
                ["transition", "Transition"],
                ["other", "Other brands"],
              ]
                .filter(([key]) => key !== "other" || bikesByBrand.other.length)
                .map(([key, title]) => (
                  <OtherBikesBrandSection
                    key={key}
                    id={OTHER_BIKE_BRAND_SECTION_IDS[key]}
                    title={title}
                    bikes={bikesByBrand[key]}
                    onRefresh={fetchBikes}
                    expandedIds={expandedIds}
                    toggle={toggle}
                  />
                ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default AddNewBike;
