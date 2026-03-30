import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  InputAdornment,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import { Image } from "cloudinary-react";
import Fuse from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBikesCached } from "api/getAllBikesCached";
import { extractPublicId, getBikeFirstImageUrl } from "utils/bikeDisplay";

function buildSearchString(bike) {
  const parts = [bike.brand, bike.name, bike.type];
  if (bike.material && bike.material !== "N/A") {
    parts.push(bike.material);
  }
  return parts.filter(Boolean).join(" ");
}

export default function NavBarGlobalSearch({ isOverlay = false }) {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    getAllBikesCached()
      .then(setBikes)
      .catch(() => setBikes([]));
  }, []);

  const bikesForFuse = useMemo(
    () =>
      bikes.map((b) => ({
        ...b,
        searchString: buildSearchString(b),
      })),
    [bikes]
  );

  const fuse = useMemo(
    () =>
      new Fuse(bikesForFuse, {
        keys: ["searchString"],
        threshold: 0.32,
        ignoreLocation: true,
      }),
    [bikesForFuse]
  );

  const filteredBikes = useMemo(() => {
    const q = searchValue.trim();
    if (!q) return [];
    return fuse.search(q).slice(0, 10).map((r) => r.item);
  }, [fuse, searchValue]);

  useEffect(() => {
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const goToBike = (bike) => {
    setSearchValue("");
    setOpen(false);
    navigate(`/shop/${bike.brand}/${bike._id}`);
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

  return (
    <Box ref={rootRef} sx={{ position: "relative", width: "100%" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <OutlinedInput
          size="small"
          fullWidth
          placeholder="Search bikes…"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          inputProps={{
            "aria-label": "Search bikes",
            "aria-expanded": open && filteredBikes.length > 0,
            "aria-controls": "nav-bike-search-results",
          }}
          sx={{
            fontSize: "0.875rem",
            ...inputSx,
          }}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            </InputAdornment>
          }
        />
      </form>

      {open && filteredBikes.length > 0 && (
        <Paper
          id="nav-bike-search-results"
          elevation={8}
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "calc(100% + 4px)",
            zIndex: (t) => t.zIndex.modal,
            maxHeight: 360,
            overflow: "auto",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {filteredBikes.map((bike) => {
            const url = getBikeFirstImageUrl(bike);
            const publicId = url ? extractPublicId(url) : null;
            return (
              <Box
                key={bike._id}
                component="button"
                type="button"
                onClick={() => goToBike(bike)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  width: "100%",
                  p: 1,
                  border: "none",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  cursor: "pointer",
                  textAlign: "left",
                  "&:last-of-type": { borderBottom: "none" },
                  "&:hover": { bgcolor: "action.hover" },
                }}
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
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  ) : null}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {bike.brand} {bike.name}
                </Typography>
              </Box>
            );
          })}
        </Paper>
      )}
    </Box>
  );
}
