import CloseIcon from "@mui/icons-material/Close";
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
import { NAV_BAR_BG } from "components/General/NavBar";
import { invalidateAllBikesCache } from "api/getAllBikesCached";
import axios from "axios";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isCloudinaryUrl } from "utils/bikeDisplay";

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
    const fileName = `${base} ${colorName}`.replace(/ /g, "-");
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

function OtherBikeEditor({ bike, onRefresh }) {
  const models = useMemo(() => {
    try {
      const arr = JSON.parse(bike.models || "[]");
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }, [bike.models]);

  const colors = useMemo(() => {
    try {
      return JSON.parse(bike.colors || "{}");
    } catch {
      return {};
    }
  }, [bike.colors]);

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

  const handlePublicChange = async (event) => {
    const checked = event.target.checked;
    setIsPublic(checked);
    const newBike = { public: checked };
    try {
      await axios.patch(`${apiBase}/api/bikes/other/${bike._id}`, { newBike }, { withCredentials: true });
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
      await axios.patch(`${apiBase}/api/bikes/other/${bike._id}`, { newBike }, { withCredentials: true });
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
    const year = e.target.year.value;
    const price = e.target.price.value;
    const saleprice = e.target.saleprice.value;
    const costRaw = (e.target.costPrice?.value ?? "").trim();
    let costPrice = bike.costPrice;
    if (costRaw === "") costPrice = null;
    else {
      const n = Number(costRaw);
      if (Number.isFinite(n) && n >= 0) costPrice = n;
    }
    const newBike = { type: editType, description, link, year, price, saleprice, costPrice };
    try {
      await axios.patch(`${apiBase}/api/bikes/other/${bike._id}`, { newBike }, { withCredentials: true });
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
    const brandPart = bike.brand ?? "";
    const yearPart = bike.year ?? "";
    const fullName = `${yearPart} ${brandPart} ${next}`.replace(/\s+/g, " ").trim();
    try {
      await axios.patch(
        `${apiBase}/api/bikes/other/${bike._id}`,
        { newBike: { name: next, fullName } },
        { withCredentials: true }
      );
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

  const editForm = (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, maxWidth: 440 }}>
      <form onSubmit={handleEditDetailsSubmit}>
        <Stack spacing={2}>
          <FormLabel id="other-bike-type">Bike type</FormLabel>
          <RadioGroup
            aria-labelledby="other-bike-type"
            name="other-bike-type"
            value={editType}
            onChange={(e) => setEditType(e.target.value)}
          >
            <FormControlLabel value="DH" control={<Radio size="small" />} label="DH" />
            <FormControlLabel
              value="Enduro / All Mountain"
              control={<Radio size="small" />}
              label="Enduro / All Mountain"
            />
            <FormControlLabel value="Trail" control={<Radio size="small" />} label="Trail" />
            <FormControlLabel value="XC" control={<Radio size="small" />} label="XC" />
            <FormControlLabel value="Dirt Jumper" control={<Radio size="small" />} label="Dirt Jumper" />
            <FormControlLabel value="Recreational" control={<Radio size="small" />} label="Recreational" />
            <FormControlLabel value="Kids" control={<Radio size="small" />} label="Kids" />
            <FormControlLabel value="E-Bike" control={<Radio size="small" />} label="E-Bike" />
            <FormControlLabel value="Frameset" control={<Radio size="small" />} label="Frameset" />
          </RadioGroup>
          <TextField id="description" name="description" label="Description" defaultValue={bike.description} multiline minRows={3} fullWidth />
          <TextField id="link" name="link" label="Link" defaultValue={bike.link} fullWidth />
          <TextField id="year" name="year" label="Year" defaultValue={bike.year} fullWidth />
          <TextField id="price" name="price" label="Price" defaultValue={bike.price} fullWidth type="number" />
          <TextField id="saleprice" name="saleprice" label="Sale price" defaultValue={bike.saleprice ?? ""} fullWidth type="number" />
          <TextField
            id="costPrice"
            name="costPrice"
            label="Cost"
            defaultValue={bike.costPrice ?? ""}
            fullWidth
            type="number"
            inputProps={{ min: 0, step: "any" }}
            helperText="Leave blank to clear"
          />
          <Button type="submit" variant="contained" sx={{ bgcolor: NAV_BAR_BG }}>
            Save details
          </Button>
          <Button type="button" variant="text" onClick={() => setEdit(false)}>
            Cancel
          </Button>
        </Stack>
      </form>
    </Paper>
  );

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, overflow: "visible" }}>
      <CardContent sx={{ "&:last-child": { pb: 2 } }}>
        <Dialog open={renameOpen} onClose={() => setRenameOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>Edit bike name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name (without changing brand/year here)"
              fullWidth
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              helperText={`fullName will update to: ${bike.year ?? ""} ${bike.brand ?? ""} ${renameValue.trim() || "…"}`.replace(/\s+/g, " ").trim()}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
            <Button onClick={handleRenameSave} variant="contained" sx={{ bgcolor: NAV_BAR_BG }}>
              Save name
            </Button>
          </DialogActions>
        </Dialog>

        <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems={{ xs: "stretch", lg: "flex-start" }}>
          <Stack spacing={2} flex={{ xs: 1, lg: 1.3 }} minWidth={0}>
            <Box>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
              >
                <Box>
                  <Typography variant="h6" fontWeight={800} sx={{ color: NAV_BAR_BG }}>
                    {bike.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {bike.brand} · Year {bike.year}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DriveFileRenameOutlineIcon />}
                    onClick={() => {
                      setRenameValue(bike.name || "");
                      setRenameOpen(true);
                    }}
                    sx={{ borderColor: NAV_BAR_BG, color: NAV_BAR_BG }}
                  >
                    Edit name
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    disabled={deleting}
                    onClick={handleDeleteBike}
                  >
                    {deleting ? "Deleting…" : "Delete bike"}
                  </Button>
                </Stack>
              </Stack>
            </Box>

            <Stack
              direction="row"
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
              spacing={2}
              sx={{
                py: 0.5,
                px: 1,
                borderRadius: 1,
                bgcolor: "action.hover",
              }}
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
              <Typography variant="caption" color="text.secondary" sx={{ flex: "1 1 200px", minWidth: 0 }}>
                Archived models are hidden from the shop list.
              </Typography>
            </Stack>

            <Typography variant="subtitle2" fontWeight={700}>
              Availability
            </Typography>
            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
              {models.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No SKU variants found.
                </Typography>
              ) : (
                models.map((row, idx) => (
                  <Paper
                    key={`${row?.partNumber ?? "na"}-${row?.color ?? "na"}-${row?.size ?? "na"}-${idx}`}
                    variant="outlined"
                    sx={{ p: 1, minWidth: 160 }}
                  >
                    <Typography variant="caption" display="block">
                      {row?.color || "—"} / {row?.size || "—"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {row?.partNumber || "—"}
                    </Typography>
                  </Paper>
                ))
              )}
            </Stack>
          </Stack>

          <Stack spacing={2} flex={{ xs: 1, lg: 1 }} minWidth={0}>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
              {!edit ? (
                <Button
                  variant="outlined"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => {
                    setEditType(bike.type);
                    setEdit(true);
                  }}
                  sx={{ borderColor: NAV_BAR_BG, color: NAV_BAR_BG }}
                >
                  Edit details
                </Button>
              ) : null}
            </Stack>
            {edit ? (
              editForm
            ) : (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Type:</strong> {bike.type || "—"}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Year:</strong> {bike.year}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Price:</strong> ${bike.price}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Sale:</strong> {bike.saleprice != null ? `$${bike.saleprice}` : "—"}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Cost:</strong>{" "}
                  {bike.costPrice != null && bike.costPrice !== "" ? `$${bike.costPrice}` : "—"}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Description:</strong> {bike.description || "—"}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, wordBreak: "break-all" }}>
                  <strong>Link:</strong> {bike.link || "—"}
                </Typography>
              </Paper>
            )}
          </Stack>

          <Stack spacing={1.5} flex={{ xs: 1, lg: 1.2 }} minWidth={0} width="100%">
            <Typography variant="subtitle2" fontWeight={700}>
              Photos by color
            </Typography>
            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1.5}>
              {Object.keys(colors).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No colors on this bike yet.
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
    </Card>
  );
}

const OTHER_BIKES_LIST_SCROLL_MARGIN = 96;

const OTHER_BIKE_BRAND_SECTION_IDS = {
  transition: "other-bikes-brand-transition",
  norco: "other-bikes-brand-norco",
  ibis: "other-bikes-brand-ibis",
};

function scrollToOtherBikeBrandSection(elementId) {
  document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function OtherBikesBrandNav({ transitionCount, norcoCount, ibisCount }) {
  const items = [
    { id: OTHER_BIKE_BRAND_SECTION_IDS.transition, label: "Transition", count: transitionCount },
    { id: OTHER_BIKE_BRAND_SECTION_IDS.norco, label: "Norco", count: norcoCount },
    { id: OTHER_BIKE_BRAND_SECTION_IDS.ibis, label: "Ibis", count: ibisCount },
  ];

  return (
    <Box
      component="nav"
      aria-label="Jump to brand in other bikes list"
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
        px: { xs: 0, md: 0 },
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
          onClick={() => scrollToOtherBikeBrandSection(id)}
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

function OtherBikesBrandSection({ id, title, subtitle, bikes, onRefresh }) {
  return (
    <Box
      id={id}
      sx={{
        scrollMarginTop: OTHER_BIKES_LIST_SCROLL_MARGIN,
      }}
    >
      <Typography variant="h6" fontWeight={800} sx={{ color: NAV_BAR_BG }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2, maxWidth: 720 }}>
        {subtitle}
      </Typography>
      {bikes.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
          No bikes in this section.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {bikes.map((bike) => (
            <OtherBikeEditor key={bike._id} bike={bike} onRefresh={onRefresh} />
          ))}
        </Stack>
      )}
    </Box>
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
        setBikes(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const [listVisibility, setListVisibility] = useState("all");
  const [listSort, setListSort] = useState("name-asc");

  const filteredBikes = useMemo(() => {
    let arr = Array.isArray(bikes) ? [...bikes] : [];
    if (listVisibility === "public") arr = arr.filter((b) => b.public);
    if (listVisibility === "private") arr = arr.filter((b) => !b.public);
    return arr;
  }, [bikes, listVisibility]);

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
    const fullName = `${year} ${brand} ${name}`.trim();

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
          availability: "Out of Stock",
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
    } catch {
      alert("Bike not added.");
    }
  };

  return (
    <Stack spacing={3} sx={{ width: "100%", maxWidth: 1280, mx: "auto", px: { xs: 1, sm: 2 }, py: 2 }}>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleClose} severity="success" variant="filled">
          Bike added.
        </Alert>
      </Snackbar>

      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" fontWeight={700} sx={{ color: NAV_BAR_BG, mb: 2 }}>
          Add a bike (Norco / Ibis / Transition / other)
        </Typography>
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
            const el = e.target;
            if (e.key === "Enter" && el instanceof HTMLElement && el.tagName !== "TEXTAREA") {
            e.preventDefault();
          }
        }}
      >
          <Stack spacing={2} sx={{ maxWidth: 560 }}>
            <FormLabel>Brand</FormLabel>
            <RadioGroup row value={brand} onChange={(e) => setBrand(e.target.value)} name="brand">
              <FormControlLabel value="Transition" control={<Radio size="small" />} label="Transition" />
              <FormControlLabel value="Norco" control={<Radio size="small" />} label="Norco" />
              <FormControlLabel value="Ibis" control={<Radio size="small" />} label="Ibis" />
              <FormControlLabel value="other" control={<Radio size="small" />} label="Other" />
        </RadioGroup>
            <FormLabel>Bike type</FormLabel>
            <RadioGroup row value={type} onChange={(e) => setType(e.target.value)} name="type">
              <FormControlLabel value="DH" control={<Radio size="small" />} label="DH" />
              <FormControlLabel value="Enduro / All Mountain" control={<Radio size="small" />} label="Enduro / AM" />
              <FormControlLabel value="Trail" control={<Radio size="small" />} label="Trail" />
              <FormControlLabel value="XC" control={<Radio size="small" />} label="XC" />
              <FormControlLabel value="Dirt Jumper" control={<Radio size="small" />} label="DJ" />
              <FormControlLabel value="Recreational" control={<Radio size="small" />} label="Rec" />
              <FormControlLabel value="Kids" control={<Radio size="small" />} label="Kids" />
              <FormControlLabel value="E-Bike" control={<Radio size="small" />} label="E-Bike" />
              <FormControlLabel value="Frameset" control={<Radio size="small" />} label="Frameset" />
        </RadioGroup>
            <TextField
              id="year"
              name="year"
              label="Year"
              required
              fullWidth
              size="small"
              value={draftYear}
              onChange={(e) => setDraftYear(e.target.value)}
            />
            <TextField
              id="name"
              name="name"
              label="Name (without brand)"
              required
              fullWidth
              size="small"
              value={draftBikeName}
              onChange={(e) => setDraftBikeName(e.target.value)}
            />
            <TextField id="price" name="price" label="Price" required fullWidth size="small" type="number" />
            <TextField id="saleprice" name="saleprice" label="Sale price (optional)" fullWidth size="small" type="number" />
            <TextField
              id="costPrice"
              name="costPrice"
              label="Cost (optional)"
              fullWidth
              size="small"
              type="number"
              inputProps={{ min: 0, step: "any" }}
            />
            <TextField id="description" name="description" label="Description" multiline minRows={3} fullWidth size="small" />
            <TextField id="link" name="link" label="Link" fullWidth size="small" />
            <FormLabel>Add sizes (smallest → largest)</FormLabel>
            <AddSizes sizes={sizeArray} setSizes={setSizeArray} />
            <AddColorsForm
              colors={colors}
              setColors={setColors}
              colorImages={colorImages}
              setColorImages={setColorImages}
              publicIdBaseRef={publicIdBaseRef}
              patchColorUrl={patchColorUrl}
            />
            <Button type="submit" variant="contained" sx={{ bgcolor: NAV_BAR_BG, alignSelf: "flex-start" }}>
              Add bike
          </Button>
        </Stack>
      </form>
      </Paper>

      <Box>
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: NAV_BAR_BG, mb: 1.5 }}>
          Existing “other” bikes
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 2, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="other-bikes-visibility">Visibility</InputLabel>
            <Select
              labelId="other-bikes-visibility"
              label="Visibility"
              value={listVisibility}
              onChange={(e) => setListVisibility(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="public">Public only</MenuItem>
              <MenuItem value="private">Private only</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="other-bikes-sort">Sort</InputLabel>
            <Select
              labelId="other-bikes-sort"
              label="Sort"
              value={listSort}
              onChange={(e) => setListSort(e.target.value)}
            >
              <MenuItem value="name-asc">Name A–Z</MenuItem>
              <MenuItem value="public-first">Public first</MenuItem>
              <MenuItem value="private-first">Private first</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        {!bikes?.length ? (
          <Typography color="text.secondary">No bikes in this list yet.</Typography>
        ) : filteredBikes.length === 0 ? (
          <Typography color="text.secondary">No bikes match this filter.</Typography>
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
            <OtherBikesBrandNav
              transitionCount={bikesByBrand.transition.length}
              norcoCount={bikesByBrand.norco.length}
              ibisCount={bikesByBrand.ibis.length}
            />
            <Stack spacing={4} sx={{ flex: 1, minWidth: 0 }}>
              <OtherBikesBrandSection
                id={OTHER_BIKE_BRAND_SECTION_IDS.transition}
                title="Transition"
                subtitle="Bikes on this admin list with brand Transition."
                bikes={bikesByBrand.transition}
                onRefresh={fetchBikes}
              />
              <OtherBikesBrandSection
                id={OTHER_BIKE_BRAND_SECTION_IDS.norco}
                title="Norco"
                subtitle="Bikes on this admin list with brand Norco."
                bikes={bikesByBrand.norco}
                onRefresh={fetchBikes}
              />
              <OtherBikesBrandSection
                id={OTHER_BIKE_BRAND_SECTION_IDS.ibis}
                title="Ibis"
                subtitle="Bikes on this admin list with brand Ibis."
                bikes={bikesByBrand.ibis}
                onRefresh={fetchBikes}
              />
              {bikesByBrand.other.length > 0 ? (
                <Box sx={{ pt: 1 }}>
                  <Typography variant="h6" fontWeight={800} sx={{ color: NAV_BAR_BG }}>
                    Other brands
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2, maxWidth: 720 }}>
                    Brand set to “other” or anything other than Transition, Norco, or Ibis. Not in the jump
                    links above.
                  </Typography>
                  <Stack spacing={2}>
                    {bikesByBrand.other.map((bike) => (
                      <OtherBikeEditor key={bike._id} bike={bike} onRefresh={fetchBikes} />
                    ))}
                  </Stack>
                </Box>
              ) : null}
            </Stack>
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default AddNewBike;
