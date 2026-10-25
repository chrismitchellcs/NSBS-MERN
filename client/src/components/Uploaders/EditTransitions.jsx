import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  FormControlLabel,
  FormLabel,
  InputAdornment,
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
import { memo, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { NAV_BAR_BG } from "components/General/NavBar";
import { OPEN_TRANSITION_BIKE_EVENT } from "utils/transitionAdminChecks";
import {
  adminCostListSuffix,
  buildBikeAdminSearchHay,
  looseAdminSearchMatches,
} from "utils/adminBikeSearch";

const apiBase = process.env.REACT_APP_VERCEL_DOMAIN;

function TransitionBikeEditorFn({ bike, onRefresh, openToken = 0 }) {
  const cardRef = useRef(null);
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
        price: model.price,
        saleprice: model.saleprice,
      };
    });
    return m;
  }, [models]);

  const [isPublic, setIsPublic] = useState(bike.public);
  const [isArchived, setIsArchived] = useState(Boolean(bike.archived));
  const [edit, setEdit] = useState(false);
  const [editType, setEditType] = useState(bike.type);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  useEffect(() => {
    setIsPublic(bike.public);
    setIsArchived(Boolean(bike.archived));
    setEditType(bike.type);
  }, [bike._id, bike.archived, bike.public, bike.type]);

  useEffect(() => {
    if (edit) setDetailsExpanded(true);
  }, [edit]);

  useEffect(() => {
    if (!openToken) return;
    setDetailsExpanded(true);
    requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [openToken]);

  const toggleDetailsExpanded = () => {
    setDetailsExpanded((open) => {
      if (open) setEdit(false);
      return !open;
    });
  };

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
      onRefresh();
    } catch {
      alert("Could not update visibility.");
      setIsPublic(!checked);
    }
  };

  const handleArchivedChange = async (event) => {
    const checked = event.target.checked;
    setIsArchived(checked);
    const newBike = { ...bike, archived: checked };
    if (checked) {
      newBike.public = false;
      setIsPublic(false);
    }
    try {
      await axios.patch(
        `${apiBase}/api/bikes/transition/${bike._id}`,
        { newBike },
        { withCredentials: true }
      );
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
            <FormLabel id="bike-type-label">Bike type</FormLabel>
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
              <FormControlLabel value="Frameset" control={<Radio size="small" />} label="Frameset" />
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
    <Card
      ref={cardRef}
      variant="outlined"
      sx={{ borderRadius: 2, overflow: "visible", scrollMarginTop: SECTION_SCROLL_MARGIN }}
    >
      <CardContent sx={{ "&:last-child": { pb: 2 } }}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1}
          >
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ color: NAV_BAR_BG }}>
                {bike.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Year 20{bike.year} · ${bike.price}
                {bike.saleprice != null ? ` · Sale $${bike.saleprice}` : ""}
                {adminCostListSuffix(bike.costPrice)}
              </Typography>
            </Box>
            <Button
              type="button"
              size="small"
              variant="outlined"
              onClick={toggleDetailsExpanded}
              endIcon={detailsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ borderColor: NAV_BAR_BG, color: NAV_BAR_BG, textTransform: "none", flexShrink: 0 }}
            >
              {detailsExpanded ? "Hide details & photos" : "Details & photos"}
            </Button>
          </Stack>

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
                        {meta.price != null && meta.price !== "" ? (
                          <Typography variant="caption" color="warning.main" display="block">
                            Own price ${meta.price}
                            {Number(meta.saleprice) > 0 ? ` · Sale $${meta.saleprice}` : ""}
                          </Typography>
                        ) : null}
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>

          <Collapse in={detailsExpanded} timeout="auto" unmountOnExit>
            <Stack spacing={3} sx={{ pt: 1 }}>
              <Divider />
              <Stack
                direction={{ xs: "column", lg: "row" }}
                spacing={3}
                alignItems={{ xs: "stretch", lg: "flex-start" }}
              >
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
                  </Stack>
                  {edit ? (
                    editForm
                  ) : (
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, width: "100%" }}>
                      <Typography variant="body2">
                        <strong>Bike type:</strong> {bike.type || "—"}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Price:</strong> ${bike.price}
                        {bike.saleprice != null ? ` · Sale $${bike.saleprice}` : ""}
                        {adminCostListSuffix(bike.costPrice)}
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

                {detailsExpanded ? (
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
                            loadRemoteImage
                          />
                        ))
                      )}
                    </Stack>
                  </Stack>
                ) : null}
              </Stack>
            </Stack>
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  );
}

const TransitionBikeEditor = memo(TransitionBikeEditorFn);

/** Admin list: drafts (private, not archived) → live → archived at bottom. */
function transitionAdminSortTier(bike) {
  if (bike.archived) return 2;
  if (!bike.public) return 0;
  return 1;
}

const SECTION_SCROLL_MARGIN = 96;

function scrollToTransitionSection(elementId) {
  document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function TransitionSectionNav({ counts }) {
  const items = [
    { id: "transition-stock-upload", label: "Stock upload", count: null },
    { id: "transition-section-drafts", label: "Drafts", count: counts.drafts },
    { id: "transition-section-live", label: "Live on site", count: counts.live },
    { id: "transition-section-archived", label: "Archived", count: counts.archived },
  ];

  return (
    <Box
      component="nav"
      aria-label="Jump to Transition admin sections"
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
          onClick={() => scrollToTransitionSection(id)}
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
          {count == null ? label : `${label} (${count})`}
        </Button>
      ))}
    </Box>
  );
}

function TransitionBikeSection({ id, title, subtitle, bikes, onRefresh, openRequest }) {
  return (
    <Box
      id={id}
      sx={{
        scrollMarginTop: SECTION_SCROLL_MARGIN,
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
          {bikes.map((b) => (
            <TransitionBikeEditor
              key={b._id}
              bike={b}
              onRefresh={onRefresh}
              openToken={openRequest && openRequest.id === b._id ? openRequest.token : 0}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

const EditTransitions = ({ bikes, setBikes }) => {
  const [adminSearch, setAdminSearch] = useState("");
  const deferredSearch = useDeferredValue(adminSearch);
  const [openRequest, setOpenRequest] = useState(null);

  useEffect(() => {
    let clearTimer;
    const onOpen = (e) => {
      const id = e.detail;
      if (!id) return;
      // Clear search so the requested bike is rendered, then let its editor expand and scroll.
      setAdminSearch("");
      setOpenRequest((prev) => ({ id, token: (prev?.token || 0) + 1 }));
      // Drop the request once handled so a later remount (search, publish toggle) doesn't re-scroll.
      clearTimeout(clearTimer);
      clearTimer = setTimeout(() => setOpenRequest(null), 1500);
    };
    window.addEventListener(OPEN_TRANSITION_BIKE_EVENT, onOpen);
    return () => {
      clearTimeout(clearTimer);
      window.removeEventListener(OPEN_TRANSITION_BIKE_EVENT, onOpen);
    };
  }, []);

  const fetchBikes = useCallback(async () => {
    try {
      const res = await axios.get(`${apiBase}/api/bikes/alltransition`, {
        withCredentials: true,
      });
      setBikes(res.data);
    } catch (e) {
      console.error(e);
    }
  }, [setBikes]);

  /** Precompute once per `bikes` fetch so filtering doesn’t rebuild long strings every keystroke. */
  const bikesWithSearchHay = useMemo(() => {
    if (!bikes?.length) return [];
    return bikes.map((b) => ({
      bike: b,
      hay: buildBikeAdminSearchHay(b),
    }));
  }, [bikes]);

  const filteredBikes = useMemo(() => {
    if (!bikes?.length) return [];
    if (!deferredSearch.trim()) return bikes;
    return bikesWithSearchHay
      .filter(({ hay }) => looseAdminSearchMatches(hay, deferredSearch))
      .map(({ bike }) => bike);
  }, [bikes, bikesWithSearchHay, deferredSearch]);

  const sortedBikes = useMemo(() => {
    if (!filteredBikes.length) return [];
    return [...filteredBikes].sort((a, b) => {
      const d = transitionAdminSortTier(a) - transitionAdminSortTier(b);
      if (d !== 0) return d;
      return (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" });
    });
  }, [filteredBikes]);

  const grouped = useMemo(() => {
    const drafts = [];
    const live = [];
    const archived = [];
    sortedBikes.forEach((b) => {
      const t = transitionAdminSortTier(b);
      if (t === 0) drafts.push(b);
      else if (t === 1) live.push(b);
      else archived.push(b);
    });
    return { drafts, live, archived };
  }, [sortedBikes]);

  const counts = useMemo(
    () => ({
      drafts: grouped.drafts.length,
      live: grouped.live.length,
      archived: grouped.archived.length,
    }),
    [grouped]
  );

  if (!bikes?.length) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        No Transition bikes loaded yet. Upload a stock file above or check the API.
      </Typography>
    );
  }

  const noSearchMatches =
    deferredSearch.trim().length > 0 && filteredBikes.length === 0;

  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
        maxWidth: 1280,
        mx: "auto",
        px: { xs: 1, sm: 2 },
        py: 2,
      }}
    >
      <TextField
        size="small"
        placeholder="Search — words in any order (e.g. sight tq)"
        value={adminSearch}
        onChange={(e) => setAdminSearch(e.target.value)}
        aria-label="Search Transition bikes"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
        sx={{ maxWidth: { xs: "100%", sm: 400 } }}
      />
      {noSearchMatches ? (
        <Typography variant="body2" color="text.secondary">
          No bikes match &quot;{deferredSearch.trim()}&quot;. Try another term or clear the search.
        </Typography>
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
          <TransitionSectionNav counts={counts} />
          <Stack spacing={4} sx={{ flex: 1, minWidth: 0 }}>
            <TransitionBikeSection
              id="transition-section-drafts"
              title="Drafts"
              subtitle="Private and not archived — usually new models that still need photos, description, and details before you mark them public."
              bikes={grouped.drafts}
              onRefresh={fetchBikes}
              openRequest={openRequest}
            />
            <TransitionBikeSection
              id="transition-section-live"
              title="Live on site"
              subtitle="Public and visible to customers on the shop (not archived)."
              bikes={grouped.live}
              onRefresh={fetchBikes}
              openRequest={openRequest}
            />
            <TransitionBikeSection
              id="transition-section-archived"
              title="Archived"
              subtitle="Old stock or models you want to keep in the database but hidden from the storefront."
              bikes={grouped.archived}
              onRefresh={fetchBikes}
              openRequest={openRequest}
            />
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

export default EditTransitions;
