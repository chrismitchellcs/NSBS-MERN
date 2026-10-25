import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import { Box, InputAdornment, OutlinedInput, Paper, Typography } from "@mui/material";
import { Image } from "cloudinary-react";
import Fuse from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBikesCached } from "api/getAllBikesCached";
import { bikePath } from "seo/seoData.mjs";
import { extractPublicId, getBikeFirstImageUrl } from "utils/bikeDisplay";
import { bikeHasVariantPricing, formatCadPrice, hasActiveShopSale } from "utils/shopPrice";

const MAX_RESULTS = 8;

function buildSearchString(bike) {
  const parts = [bike.brand, bike.name, bike.type];
  if (bike.material && bike.material !== "N/A") {
    parts.push(bike.material);
  }
  return parts.filter(Boolean).join(" ");
}

function ResultPrice({ bike }) {
  const from = bikeHasVariantPricing(bike) ? "From " : "";
  if (hasActiveShopSale(bike.saleprice)) {
    return (
      <Typography component="span" variant="caption" sx={{ color: "text.secondary" }}>
        {from}
        <Box component="span" sx={{ textDecoration: "line-through", mr: 0.5 }}>
          ${formatCadPrice(bike.price)}
        </Box>
        <Box component="span" sx={{ color: "error.main", fontWeight: 600 }}>
          ${formatCadPrice(bike.saleprice)}
        </Box>
      </Typography>
    );
  }
  return (
    <Typography component="span" variant="caption" sx={{ color: "text.secondary" }}>
      {from}${formatCadPrice(bike.price)}
    </Typography>
  );
}

/**
 * Bike search with live results. Enter (or "See all results") opens the shop filtered by the
 * query; arrow keys move through results; Esc closes. `inline` renders results in the page flow
 * (phone search panel) instead of a floating dropdown.
 */
export default function NavBarGlobalSearch({
  isOverlay = false,
  inline = false,
  autoFocus = false,
  onNavigate,
}) {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    getAllBikesCached()
      .then(setBikes)
      .catch(() => setBikes([]));
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(
        bikes.map((b) => ({ ...b, searchString: buildSearchString(b) })),
        { keys: ["searchString"], threshold: 0.32, ignoreLocation: true }
      ),
    [bikes]
  );

  const query = searchValue.trim();
  const results = useMemo(
    () => (query ? fuse.search(query).slice(0, MAX_RESULTS).map((r) => r.item) : []),
    [fuse, query]
  );
  /** Bikes plus the trailing "See all results" row. */
  const optionCount = query ? results.length + 1 : 0;
  const showResults = (inline || open) && query.length > 0;

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    if (inline) return undefined;
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [inline]);

  const finish = (to) => {
    setSearchValue("");
    setOpen(false);
    inputRef.current?.blur();
    navigate(to);
    onNavigate?.();
  };
  const goToBike = (bike) => finish(bikePath(bike));
  const goToAllResults = () => {
    if (query) finish(`/shop?q=${encodeURIComponent(query)}`);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" && optionCount) {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i + 1) % optionCount);
    } else if (e.key === "ArrowUp" && optionCount) {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? optionCount - 1 : i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      if (!inline) inputRef.current?.blur();
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (activeIndex >= 0 && activeIndex < results.length) goToBike(results[activeIndex]);
    else goToAllResults();
  };

  const noOutline = {
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
    "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
  };

  const inputSx = isOverlay
    ? {
        bgcolor: "rgba(255,255,255,0.45)",
        borderRadius: "12px",
        transition: "background-color 0.2s ease, box-shadow 0.2s ease",
        ...noOutline,
        "&:hover": { bgcolor: "rgba(255,255,255,0.65)" },
        "&.Mui-focused": {
          bgcolor: "rgba(255,255,255,0.72)",
          boxShadow: "0 0 0 2px rgba(0,0,0,0.12)",
        },
      }
    : {
        bgcolor: "rgba(0,0,0,0.05)",
        borderRadius: "12px",
        transition: "background-color 0.2s ease, box-shadow 0.2s ease",
        ...noOutline,
        "&:hover": { bgcolor: "rgba(0,0,0,0.09)" },
        "&.Mui-focused": {
          bgcolor: "rgba(0,0,0,0.08)",
          boxShadow: "0 0 0 2px rgba(0,0,0,0.14)",
        },
      };

  const optionId = (i) => `nav-bike-search-option-${i}`;
  const rowSx = (i) => ({
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    width: "100%",
    p: 1,
    border: "none",
    borderBottom: "1px solid",
    borderColor: "divider",
    bgcolor: i === activeIndex ? "action.selected" : "background.paper",
    cursor: "pointer",
    textAlign: "left",
    color: "text.primary",
    "&:last-of-type": { borderBottom: "none" },
    "&:hover": { bgcolor: i === activeIndex ? "action.selected" : "action.hover" },
  });

  const resultList = (
    <Box id="nav-bike-search-results" role="listbox" aria-label="Bike search results">
      {results.length === 0 ? (
        <Typography variant="body2" sx={{ p: 1.5, color: "text.secondary" }}>
          No quick matches. Press Enter to search the shop.
        </Typography>
      ) : null}
      {results.map((bike, i) => {
        const url = getBikeFirstImageUrl(bike);
        const publicId = url ? extractPublicId(url) : null;
        return (
          <Box
            key={bike._id}
            id={optionId(i)}
            role="option"
            aria-selected={i === activeIndex}
            component="button"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => goToBike(bike)}
            sx={rowSx(i)}
          >
            <Box
              sx={{
                width: 88,
                height: 48,
                flexShrink: 0,
                borderRadius: 1,
                overflow: "hidden",
                bgcolor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {publicId ? (
                <Image
                  cloudName="ds4ukwnxl"
                  publicId={publicId}
                  width="176"
                  height="96"
                  crop="pad"
                  quality="auto"
                  fetchFormat="auto"
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                />
              ) : null}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                {bike.brand} {bike.name}
              </Typography>
              <ResultPrice bike={bike} />
            </Box>
          </Box>
        );
      })}
      <Box
        id={optionId(results.length)}
        role="option"
        aria-selected={activeIndex === results.length}
        component="button"
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={goToAllResults}
        sx={{ ...rowSx(results.length), justifyContent: "space-between", fontWeight: 600 }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
          See all results for "{query}"
        </Typography>
        <ArrowForwardIcon sx={{ fontSize: 18, color: "text.secondary" }} aria-hidden />
      </Box>
    </Box>
  );

  return (
    <Box ref={rootRef} sx={{ position: "relative", width: "100%" }}>
      <form onSubmit={onSubmit} role="search">
        <OutlinedInput
          inputRef={inputRef}
          size="small"
          fullWidth
          autoFocus={autoFocus}
          placeholder="Search bikes…"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          inputProps={{
            "aria-label": "Search bikes",
            role: "combobox",
            "aria-autocomplete": "list",
            "aria-expanded": showResults,
            "aria-controls": "nav-bike-search-results",
            "aria-activedescendant": activeIndex >= 0 ? optionId(activeIndex) : undefined,
            enterKeyHint: "search",
          }}
          sx={{ fontSize: inline ? "1rem" : "0.875rem", ...inputSx }}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            </InputAdornment>
          }
        />
      </form>

      {showResults &&
        (inline ? (
          <Box sx={{ mt: 1.5, borderRadius: 2, overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
            {resultList}
          </Box>
        ) : (
          <Paper
            elevation={8}
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              minWidth: 320,
              top: "calc(100% + 4px)",
              zIndex: (t) => t.zIndex.modal,
              maxHeight: 420,
              overflow: "auto",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {resultList}
          </Paper>
        ))}
    </Box>
  );
}
