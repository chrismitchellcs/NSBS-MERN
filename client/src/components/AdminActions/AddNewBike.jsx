import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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
  FormControlLabel,
  FormLabel,
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
import EditAvailability from "components/AdminActions/EditAvailability";
import AddSizes from "components/AdminActions/AddSizes";
import { NAV_BAR_BG } from "components/General/NavBar";
import { invalidateAllBikesCache } from "api/getAllBikesCached";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const apiBase = process.env.REACT_APP_VERCEL_DOMAIN;

function AddColorsForm({ colors, setColors }) {
  const [currentColor, setCurrentColor] = useState("");
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, width: "100%", maxWidth: 560 }}>
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
        Colors
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }} flexWrap="wrap" useFlexGap>
        <TextField
          size="small"
          value={currentColor}
          label="Color name"
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
            setCurrentColor("");
          }}
        >
          Add color
        </Button>
      </Stack>
      <Stack spacing={0.5} sx={{ mt: 1 }}>
        {colors.map((color) => (
          <Stack
            key={color}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ bgcolor: "grey.100", borderRadius: 1, px: 1, py: 0.25 }}
          >
            <Typography variant="body2">{color}</Typography>
            <IconButton
              aria-label={`Remove ${color}`}
              size="small"
              color="error"
              onClick={() => setColors((prev) => prev.filter((c) => c !== color))}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

function OtherBikeEditor({ bike, onRefresh }) {
  const colors = useMemo(() => {
    try {
      return JSON.parse(bike.colors || "{}");
    } catch {
      return {};
    }
  }, [bike.colors]);

  const [isPublic, setIsPublic] = useState(bike.public);
  const [edit, setEdit] = useState(false);
  const [editType, setEditType] = useState(bike.type);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(bike.name || "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setIsPublic(bike.public);
    setEditType(bike.type);
    setRenameValue(bike.name || "");
  }, [bike._id, bike.public, bike.type, bike.name]);

  const handlePublicChange = async (event) => {
    const checked = event.target.checked;
    setIsPublic(checked);
    const newBike = { ...bike, public: checked };
    try {
      await axios.patch(`${apiBase}/api/bikes/other/${bike._id}`, { newBike }, { withCredentials: true });
      invalidateAllBikesCache();
    } catch {
      alert("Could not update visibility.");
      setIsPublic(!checked);
    }
  };

  const handleEditDetailsSubmit = async (e) => {
    e.preventDefault();
    const description = e.target.description.value;
    const link = e.target.link.value;
    const year = e.target.year.value;
    const price = e.target.price.value;
    const saleprice = e.target.saleprice.value;
    const newBike = { ...bike, type: editType, description, link, year, price, saleprice };
    try {
      await axios.patch(`${apiBase}/api/bikes/other/${newBike._id}`, { newBike }, { withCredentials: true });
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
        { newBike: { ...bike, name: next, fullName } },
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
          <FormLabel id="other-bike-type">Type</FormLabel>
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
          </RadioGroup>
          <TextField id="description" name="description" label="Description" defaultValue={bike.description} multiline minRows={3} fullWidth />
          <TextField id="link" name="link" label="Link" defaultValue={bike.link} fullWidth />
          <TextField id="year" name="year" label="Year" defaultValue={bike.year} fullWidth />
          <TextField id="price" name="price" label="Price" defaultValue={bike.price} fullWidth type="number" />
          <TextField id="saleprice" name="saleprice" label="Sale price" defaultValue={bike.saleprice ?? ""} fullWidth type="number" />
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
            <Typography variant="subtitle2" fontWeight={700}>
              Availability
            </Typography>
            <EditAvailability bike={bike} />
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
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="body2">{isPublic ? "Public" : "Private"}</Typography>
                <Switch checked={isPublic} onChange={handlePublicChange} color="success" />
              </Stack>
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

const AddNewBike = () => {
  const [open, setOpen] = useState(false);
  const [bikes, setBikes] = useState([]);
  const [sizeArray, setSizeArray] = useState([]);
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [colors, setColors] = useState([]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const year = event.target.year.value;
    const name = event.target.name.value;
    const price = event.target.price.value;
    const saleprice = event.target.saleprice.value;
    const description = event.target.description.value;
    const link = event.target.link.value;
    const fullName = `${year} ${brand} ${name}`.trim();

    const availabilityArray = [];
    const colorObject = {};
    colors.forEach((c) => {
      colorObject[c] = "";
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
      setOpen(true);
      event.target.reset();
      setBrand("");
      setType("");
      setColors([]);
      setSizeArray([]);
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
            <FormLabel>Type</FormLabel>
            <RadioGroup row value={type} onChange={(e) => setType(e.target.value)} name="type">
              <FormControlLabel value="DH" control={<Radio size="small" />} label="DH" />
              <FormControlLabel value="Enduro / All Mountain" control={<Radio size="small" />} label="Enduro / AM" />
              <FormControlLabel value="Trail" control={<Radio size="small" />} label="Trail" />
              <FormControlLabel value="XC" control={<Radio size="small" />} label="XC" />
              <FormControlLabel value="Dirt Jumper" control={<Radio size="small" />} label="DJ" />
              <FormControlLabel value="Recreational" control={<Radio size="small" />} label="Rec" />
              <FormControlLabel value="Kids" control={<Radio size="small" />} label="Kids" />
              <FormControlLabel value="E-Bike" control={<Radio size="small" />} label="E-Bike" />
        </RadioGroup>
            <TextField id="year" name="year" label="Year" required fullWidth size="small" />
            <TextField id="name" name="name" label="Name (without brand)" required fullWidth size="small" />
            <TextField id="price" name="price" label="Price" required fullWidth size="small" type="number" />
            <TextField id="saleprice" name="saleprice" label="Sale price (optional)" fullWidth size="small" type="number" />
            <TextField id="description" name="description" label="Description" multiline minRows={3} fullWidth size="small" />
            <TextField id="link" name="link" label="Link" fullWidth size="small" />
            <FormLabel>Add sizes (smallest → largest)</FormLabel>
            <AddSizes sizes={sizeArray} setSizes={setSizeArray} />
            <AddColorsForm colors={colors} setColors={setColors} />
            <Button type="submit" variant="contained" sx={{ bgcolor: NAV_BAR_BG, alignSelf: "flex-start" }}>
              Add bike
          </Button>
        </Stack>
      </form>
      </Paper>

      <Box>
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: NAV_BAR_BG, mb: 2 }}>
          Existing “other” bikes
        </Typography>
        {bikes?.length ? (
          <Stack spacing={2}>
            {bikes.map((bike) => (
              <OtherBikeEditor key={bike._id} bike={bike} onRefresh={fetchBikes} />
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">No bikes in this list yet.</Typography>
        )}
      </Box>
    </Stack>
  );
};

export default AddNewBike;
