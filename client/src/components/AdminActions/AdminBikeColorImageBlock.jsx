import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { Box, Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import { NAV_BAR_BG } from "components/General/NavBar";
import axios from "axios";
import { useState } from "react";
import { isCloudinaryUrl } from "utils/bikeDisplay";

const apiBase = process.env.REACT_APP_VERCEL_DOMAIN;

const VisuallyHiddenInput = (props) => (
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
 * Upload / delete per color; PATCHes `colors` JSON on Transition or Other bikes.
 * @param {{ bike: object, colorName: string, imageUrl: string, onRefresh: () => void, bikeRoute: 'transition' | 'norco' | 'other', loadRemoteImage?: boolean }} props
 */
export function AdminBikeColorImageBlock({
  bike,
  colorName,
  imageUrl,
  onRefresh,
  bikeRoute,
  /** When false, remote `imageUrl` is not used as the image src (no fetch). */
  loadRemoteImage = true,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const patchUrl =
    bikeRoute === "other"
      ? `${apiBase}/api/bikes/other/${bike._id}`
      : bikeRoute === "norco"
        ? `${apiBase}/api/bikes/norco/${bike._id}`
        : `${apiBase}/api/bikes/transition/${bike._id}`;

  const parseColors = () => {
    try {
      return JSON.parse(bike.colors || "{}");
    } catch {
      return {};
    }
  };

  const handleDelete = async () => {
    if (!imageUrl) return;
    if (
      !window.confirm(
        `Remove the “${colorName}” image from this bike and delete it from Cloudinary (if stored there)?`
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      if (isCloudinaryUrl(imageUrl)) {
        await axios.post(`${apiBase}/api/images/destroy`, { secure_url: imageUrl }, { withCredentials: true });
      }
      const next = { ...parseColors() };
      delete next[colorName];
      await axios.patch(patchUrl, { newBike: { ...bike, colors: JSON.stringify(next) } }, { withCredentials: true });
      onRefresh();
    } catch (e) {
      console.error(e);
      alert("Could not remove the image. Try again.");
    } finally {
      setDeleting(false);
    }
  };

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
    const fileName = `${bike.fullName} ${colorName}`.replace(/ /g, "-");
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
      const next = { ...parseColors(), [colorName]: secureUrl };
      await axios.patch(patchUrl, { newBike: { ...bike, colors: JSON.stringify(next) } }, { withCredentials: true });
      setSelectedFile(null);
      setPreviewUrl("");
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, width: "100%", maxWidth: 280 }}>
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
        {colorName}
      </Typography>
      <Box
        sx={{
          borderRadius: 1,
          overflow: "hidden",
          bgcolor: "grey.100",
          aspectRatio: "4/3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 140,
        }}
      >
        {previewUrl ? (
          <Box
            component="img"
            src={previewUrl}
            alt=""
            loading="lazy"
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : imageUrl && loadRemoteImage ? (
          <Box
            component="img"
            src={imageUrl}
            alt=""
            loading="lazy"
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : imageUrl ? (
          <Typography variant="caption" color="text.secondary" sx={{ px: 1, textAlign: "center" }}>
            Preview loads when this section is expanded
          </Typography>
        ) : (
          <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
            No photo
          </Typography>
        )}
      </Box>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
        <Button size="small" component="label" variant="outlined" startIcon={<PhotoCameraOutlinedIcon />}>
          {imageUrl ? "Replace" : "Upload"}
          <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
        </Button>
        {selectedFile && (
          <Button size="small" variant="contained" onClick={handleUpload} disabled={uploading} sx={{ bgcolor: NAV_BAR_BG }}>
            {uploading ? "…" : "Save"}
          </Button>
        )}
        {imageUrl && (
          <IconButton
            size="small"
            color="error"
            onClick={handleDelete}
            disabled={deleting || uploading}
            aria-label={`Delete ${colorName} image`}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>
    </Paper>
  );
}
