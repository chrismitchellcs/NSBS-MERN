import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const api = `${process.env.REACT_APP_VERCEL_DOMAIN}/api/header-hero`;

const emptyForm = {
  imageUrl: "",
  imageAlt: "",
  headline: "",
  body: "",
  ctaLabel: "Shop bikes",
  ctaPath: "/shop",
  objectPosition: "center bottom",
  sortOrder: 0,
  active: true,
};

const normalizePath = (p) => {
  if (!p || !String(p).trim()) return "/shop";
  const t = String(p).trim();
  return t.startsWith("/") ? t : `/${t}`;
};

const AdminHeaderHero = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  /** When editing, original imageUrl so text-only saves still work for legacy slides until re-uploaded. */
  const [initialImageUrl, setInitialImageUrl] = useState("");

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(api, { withCredentials: true });
      setSlides(res.data ?? []);
    } catch (e) {
      console.error(e);
      alert("Could not load hero slides. Are you logged in?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const openNew = () => {
    setEditingId(null);
    const nextOrder =
      slides.length > 0
        ? Math.max(...slides.map((s) => s.sortOrder ?? 0)) + 1
        : 0;
    setForm({ ...emptyForm, sortOrder: nextOrder });
    setSelectedFile(null);
    setPreviewUrl("");
    setInitialImageUrl("");
    setDialogOpen(true);
  };

  const openEdit = (slide) => {
    setEditingId(slide._id);
    setForm({
      imageUrl: slide.imageUrl ?? "",
      imageAlt: slide.imageAlt ?? "",
      headline: slide.headline ?? "",
      body: slide.body ?? "",
      ctaLabel: slide.ctaLabel ?? "Shop bikes",
      ctaPath: slide.ctaPath ?? "/shop",
      objectPosition: slide.objectPosition ?? "center bottom",
      sortOrder: slide.sortOrder ?? 0,
      active: slide.active !== false,
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setInitialImageUrl(slide.imageUrl ?? "");
    setDialogOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async () => {
    if (!selectedFile) {
      alert("Choose an image file first.");
      return;
    }
    const publicId = `nsbs-header-${Date.now()}`;
    setUploading(true);
    try {
      const sigRes = await axios.get(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/images/get-signature`,
        { params: { public_id: publicId }, withCredentials: true }
      );
      const sigData = sigRes.data;
      const fd = new FormData();
      fd.append("file", selectedFile);
      fd.append("api_key", sigData.apiKey);
      fd.append("timestamp", sigData.timestamp);
      fd.append("signature", sigData.signature);
      fd.append("folder", sigData.folder);
      fd.append("public_id", publicId);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`;
      const uploadRes = await axios.post(cloudinaryUrl, fd, {
        withCredentials: false,
      });
      const { secure_url: url } = uploadRes.data;
      setForm((f) => ({ ...f, imageUrl: url }));
      setPreviewUrl(url);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const saveSlide = async () => {
    const url = form.imageUrl?.trim() ?? "";
    if (!url) {
      alert("Upload an image to Cloudinary before saving.");
      return;
    }
    const isHttps = /^https:\/\//i.test(url);
    const imageUnchanged =
      editingId && url === String(initialImageUrl ?? "").trim();
    if (!isHttps && !imageUnchanged) {
      alert("Upload a new image to Cloudinary (https URL required).");
      return;
    }
    if (!form.headline?.trim()) {
      alert("Headline is required.");
      return;
    }
    const payload = {
      ...form,
      imageUrl: url,
      ctaPath: normalizePath(form.ctaPath),
      sortOrder: Number(form.sortOrder) || 0,
    };
    setSaving(true);
    try {
      if (editingId) {
        await axios.patch(`${api}/${editingId}`, payload, {
          withCredentials: true,
        });
      } else {
        await axios.post(api, payload, { withCredentials: true });
      }
      setDialogOpen(false);
      await fetchSlides();
    } catch (e) {
      console.error(e);
      alert("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const deleteSlide = async (id) => {
    if (!window.confirm("Delete this hero slide?")) return;
    try {
      await axios.delete(`${api}/${id}`, { withCredentials: true });
      await fetchSlides();
    } catch (e) {
      console.error(e);
      alert("Delete failed.");
    }
  };

  return (
    <Box sx={{ maxWidth: 960, mx: "auto", px: 2, py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h1">
          Home hero slides
        </Typography>
        <Button variant="contained" onClick={openNew}>
          Add slide
        </Button>
      </Stack>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Images must be uploaded to Cloudinary (choose file, then upload). Active slides rotate
        on the home page by sort order. If none are active, the site uses the built-in default
        hero image.
      </Typography>

      {loading ? (
        <Typography>Loading…</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Headline</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slides.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.sortOrder}</TableCell>
                <TableCell>{s.headline}</TableCell>
                <TableCell>{s.active ? "Yes" : "No"}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="Edit"
                    onClick={() => openEdit(s)}
                    size="small"
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    onClick={() => deleteSlide(s._id)}
                    size="small"
                    color="error"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {slides.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  No slides yet. Add one to replace the default home hero.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onClose={() => !saving && setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit slide" : "New slide"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Button variant="outlined" component="label">
                Choose image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              <Button
                onClick={uploadToCloudinary}
                disabled={!selectedFile || uploading}
                sx={{ ml: 1 }}
              >
                {uploading ? "Uploading…" : "Upload to Cloudinary"}
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {form.imageUrl?.trim()
                ? "Image is set. Choose a new file and upload to replace it."
                : "Choose an image and upload to Cloudinary before saving."}
            </Typography>
            {(form.imageUrl?.trim() ||
              (selectedFile && previewUrl.startsWith("blob:"))) && (
              <Box
                component="img"
                src={
                  selectedFile && previewUrl.startsWith("blob:")
                    ? previewUrl
                    : form.imageUrl.trim()
                }
                alt=""
                sx={{ maxWidth: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 1 }}
              />
            )}
            <TextField
              label="Image alt text"
              value={form.imageAlt}
              onChange={(e) => setForm((f) => ({ ...f, imageAlt: e.target.value }))}
              fullWidth
              size="small"
            />
            <TextField
              label="Headline"
              value={form.headline}
              onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Body text"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
            <TextField
              label="Button label"
              value={form.ctaLabel}
              onChange={(e) => setForm((f) => ({ ...f, ctaLabel: e.target.value }))}
              fullWidth
              size="small"
            />
            <TextField
              label="Button link (path)"
              value={form.ctaPath}
              onChange={(e) => setForm((f) => ({ ...f, ctaPath: e.target.value }))}
              fullWidth
              size="small"
              helperText="e.g. /shop or /service"
            />
            <TextField
              label="Object position (CSS)"
              value={form.objectPosition}
              onChange={(e) =>
                setForm((f) => ({ ...f, objectPosition: e.target.value }))
              }
              fullWidth
              size="small"
              helperText="e.g. center bottom"
            />
            <TextField
              label="Sort order"
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm((f) => ({ ...f, sortOrder: e.target.value }))
              }
              fullWidth
              size="small"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.active}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, active: e.target.checked }))
                  }
                />
              }
              label="Active (shown on site)"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveSlide} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminHeaderHero;
