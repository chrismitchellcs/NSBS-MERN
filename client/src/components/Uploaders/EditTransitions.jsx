import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { AdminBikeColorImageBlock } from "components/AdminActions/AdminBikeColorImageBlock";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { NAV_BAR_BG } from "components/General/NavBar";

const apiBase = process.env.REACT_APP_VERCEL_DOMAIN;

function TransitionBikeEditor({ bike, onRefresh }) {
  const models = useMemo(() => {
    try {
      return JSON.parse(bike.models || "[]");
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

  const modelMatrix = useMemo(() => {
    const m = {};
    models.forEach((model) => {
      if (!m[model.color]) m[model.color] = {};
      m[model.color][model.size] = {
        partNumber: model.partNumber,
        availability: model.availability,
      };
    });
    return m;
  }, [models]);

  const [inStoreBikes, setInStoreBikes] = useState(() => {
    try {
      return JSON.parse(bike.inStock || "[]");
    } catch {
      return [];
    }
  });

  const [isPublic, setIsPublic] = useState(bike.public);
  const [edit, setEdit] = useState(false);
  const [editType, setEditType] = useState(bike.type);
  const [newBikeColor, setNewBikeColor] = useState("");
  const [newBikeSize, setNewBikeSize] = useState("");

  useEffect(() => {
    try {
      setInStoreBikes(JSON.parse(bike.inStock || "[]"));
    } catch {
      setInStoreBikes([]);
    }
    setIsPublic(bike.public);
    setEditType(bike.type);
  }, [bike._id, bike.inStock, bike.public, bike.type]);

  const handlePublicChange = async (event) => {
    const checked = event.target.checked;
    setIsPublic(checked);
    const newBike = { ...bike, public: checked };
    try {
      await axios.patch(
        `${apiBase}/api/bikes/transition/${bike._id}`,
        { newBike },
        { withCredentials: true }
      );
    } catch {
      alert("Could not update visibility.");
      setIsPublic(!checked);
    }
  };

  const addInStore = async (size, partNumber, color) => {
    const stockItem = {
      size,
      partNumber,
      color,
      availability: "In Store",
    };
    const oldStock = JSON.parse(bike.inStock || "[]");
    if (oldStock.some((item) => item.partNumber === partNumber)) return;
    const newBike = {
      ...bike,
      inStock: JSON.stringify([...oldStock, stockItem]),
    };
    try {
      await axios.patch(
        `${apiBase}/api/bikes/transition/${bike._id}`,
        { newBike },
        { withCredentials: true }
      );
      setInStoreBikes(JSON.parse(newBike.inStock));
    } catch {
      alert("Could not update in-store list.");
    }
  };

  const removeFromStore = async (partNumber) => {
    const newInStoreBikes = inStoreBikes.filter((item) => item.partNumber !== partNumber);
    const newBike = { ...bike, inStock: JSON.stringify(newInStoreBikes) };
    try {
      await axios.patch(
        `${apiBase}/api/bikes/transition/${bike._id}`,
        { newBike },
        { withCredentials: true }
      );
      setInStoreBikes(newInStoreBikes);
    } catch {
      alert("Could not update in-store list.");
    }
  };

  const addOtherBikeToStore = async () => {
    const stockItem = {
      size: newBikeSize,
      partNumber: Date.now(),
      color: newBikeColor,
      availability: "In Store",
    };
    const oldStock = JSON.parse(bike.inStock || "[]");
    const newBike = { ...bike, inStock: JSON.stringify([...oldStock, stockItem]) };
    try {
      await axios.patch(
        `${apiBase}/api/bikes/transition/${bike._id}`,
        { newBike },
        { withCredentials: true }
      );
      setInStoreBikes(JSON.parse(newBike.inStock));
      setNewBikeColor("");
      setNewBikeSize("");
    } catch {
      alert("Could not add in-store bike.");
    }
  };

  const handleEditDetailsSubmit = async (e) => {
    e.preventDefault();
    const description = e.target.description.value;
    const link = e.target.link.value;
    const newBike = { ...bike, type: editType, description, link };
    try {
      await axios.patch(
        `${apiBase}/api/bikes/transition/${newBike._id}`,
        { newBike },
        { withCredentials: true }
      );
      onRefresh();
      setEdit(false);
    } catch {
      alert("Could not save details.");
    }
  };

  const editForm = (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, maxWidth: 420 }}>
        <form onSubmit={handleEditDetailsSubmit}>
          <Stack spacing={2}>
            <FormLabel id="bike-type-label">Type</FormLabel>
            <RadioGroup
              aria-labelledby="bike-type-label"
              name="bike-type"
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
              <FormControlLabel
                value="Dirt Jumper"
                control={<Radio size="small" />}
                label="Dirt Jumper"
              />
              <FormControlLabel
                value="Recreational"
                control={<Radio size="small" />}
                label="Recreational"
              />
              <FormControlLabel value="Kids" control={<Radio size="small" />} label="Kids" />
              <FormControlLabel value="E-Bike" control={<Radio size="small" />} label="E-Bike" />
            </RadioGroup>
            <TextField
              id="description"
              name="description"
              label="Description"
              defaultValue={bike.description}
              multiline
              minRows={3}
              fullWidth
            />
            <TextField id="link" name="link" label="Link" defaultValue={bike.link} fullWidth />
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
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={3}
          alignItems={{ xs: "stretch", lg: "flex-start" }}
          justifyContent="space-between"
        >
          <Stack spacing={2} flex={{ xs: 1, lg: 2 }} minWidth={0}>
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ color: NAV_BAR_BG }}>
                {bike.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Year 20{bike.year} · ${bike.price}
                {bike.saleprice != null ? ` · Sale $${bike.saleprice}` : ""}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Availability
              </Typography>
              <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
                {Object.entries(modelMatrix).map(([colorKey, bySize]) => (
                  <Paper key={colorKey} variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
                    <Typography variant="caption" fontWeight={700} display="block" gutterBottom>
                      {colorKey}
                    </Typography>
                    <Stack spacing={0.5}>
                      {Object.entries(bySize).map(([sizeKey, meta]) => (
                        <Paper key={`${colorKey}-${sizeKey}`} sx={{ p: 0.75, bgcolor: "grey.50" }}>
                          <Typography variant="caption" display="block">
                            {sizeKey} · {meta.partNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {meta.availability}
                          </Typography>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => addInStore(sizeKey, meta.partNumber, colorKey)}
                            sx={{ mt: 0.5, fontSize: 11, py: 0, textTransform: "none", bgcolor: NAV_BAR_BG }}
                          >
                            In store
                          </Button>
                        </Paper>
                      ))}
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Add other in-store (manual)
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1, maxWidth: 480 }}>
                Use when a build is not on the stock grid. Match color and size names exactly.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
                <TextField
                  size="small"
                  label="Color"
                  value={newBikeColor}
                  onChange={(e) => setNewBikeColor(e.target.value)}
                />
                <TextField
                  size="small"
                  label="Size"
                  value={newBikeSize}
                  onChange={(e) => setNewBikeSize(e.target.value)}
                />
                <Button variant="contained" onClick={addOtherBikeToStore} sx={{ bgcolor: NAV_BAR_BG }}>
                  Add
                </Button>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                In store
              </Typography>
              <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
                {inStoreBikes.map((row) => (
                  <Paper key={String(row.partNumber)} variant="outlined" sx={{ p: 1, minWidth: 120 }}>
                    <Typography variant="caption" display="block">
                      {row.color} / {row.size}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {row.partNumber}
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      sx={{ mt: 0.5, fontSize: 11, textTransform: "none" }}
                      onClick={() => removeFromStore(row.partNumber)}
                    >
                      Remove
                    </Button>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Stack>

          <Stack spacing={2} flex={{ xs: 1, lg: 1.1 }} minWidth={0} alignItems={{ xs: "stretch", lg: "flex-start" }}>
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
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, width: "100%" }}>
                <Typography variant="body2">
                  <strong>Type:</strong> {bike.type || "—"}
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
                  No color keys yet — upload stock or add colors first.
                </Typography>
              ) : (
                Object.entries(colors).map(([colorName, url]) => (
                  <AdminBikeColorImageBlock
                    key={colorName}
                    bike={bike}
                    colorName={colorName}
                    imageUrl={url}
                    onRefresh={onRefresh}
                    bikeRoute="transition"
                  />
                ))
              )}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const EditTransitions = ({ bikes, setBikes }) => {
  const fetchBikes = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/bikes/alltransition`, {
        withCredentials: true,
      });
      setBikes(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  if (!bikes?.length) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        No Transition bikes loaded yet. Upload a stock file above or check the API.
      </Typography>
    );
  }

  return (
    <Stack spacing={2} sx={{ width: "100%", maxWidth: 1280, mx: "auto", px: { xs: 1, sm: 2 }, py: 2 }}>
      {bikes.map((b) => (
        <TransitionBikeEditor key={b._id} bike={b} onRefresh={fetchBikes} />
      ))}
    </Stack>
  );
};

export default EditTransitions;
