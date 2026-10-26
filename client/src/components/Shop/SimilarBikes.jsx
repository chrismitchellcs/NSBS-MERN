import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { getAllBikesCached } from "api/getAllBikesCached";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { NAV_BAR_BG } from "utils/brandColors";
import { getBikeFirstImageUrl } from "utils/bikeDisplay";
import BikeCard from "./BikeCard";

const MAX_SIMILAR = 8;

/** Same type only; same brand first, then the most viewed. */
function pickSimilar(all, bike) {
  if (!bike.type) return [];
  const nameKey = (b) => String(b.name || "").trim().toLowerCase();
  return all
    .filter(
      (b) =>
        b._id !== bike._id &&
        b.type === bike.type &&
        nameKey(b) !== nameKey(bike) &&
        getBikeFirstImageUrl(b)
    )
    .sort(
      (x, y) =>
        (y.brand === bike.brand) - (x.brand === bike.brand) ||
        (Number(y.viewCount) || 0) - (Number(x.viewCount) || 0)
    )
    .slice(0, MAX_SIMILAR);
}

const arrowSx = {
  display: { xs: "none", md: "inline-flex" },
  flexShrink: 0,
  width: 44,
  height: 44,
  color: NAV_BAR_BG,
  bgcolor: "#fff",
  border: "1px solid rgba(36, 61, 51, 0.25)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  "&:hover": { bgcolor: NAV_BAR_BG, color: "#fff", borderColor: NAV_BAR_BG },
  "&.Mui-disabled": { opacity: 0.35, bgcolor: "#fff" },
};

/** Card widths that show a whole number of cards: 2 on tablets, 3 on laptops, 4 on wide screens. */
const cardWidth = {
  xs: "80%",
  sm: "calc((100% - 16px) / 2)",
  md: "calc((100% - 2 * 20px) / 3)",
  lg: "calc((100% - 3 * 20px) / 4)",
};

export default function SimilarBikes({ bike }) {
  const [all, setAll] = useState(null);
  const scrollerRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  useEffect(() => {
    let cancelled = false;
    getAllBikesCached()
      .then((list) => !cancelled && setAll(Array.isArray(list) ? list : []))
      .catch(() => !cancelled && setAll([]));
    return () => {
      cancelled = true;
    };
  }, []);

  const similar = useMemo(() => (all && bike ? pickSimilar(all, bike) : []), [all, bike]);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;
    updateEdges();
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [similar, updateEdges]);

  const scrollByPage = (dir) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  if (!similar.length) return null;
  const canScroll = !(edges.start && edges.end);

  return (
    <Box
      component="section"
      aria-labelledby="similar-bikes-title"
      sx={{ bgcolor: "#fff", borderTop: "1px solid rgba(0,0,0,0.08)", py: { xs: 4, md: 6 } }}
    >
      <Box sx={{ maxWidth: 1680, mx: "auto", px: { xs: 2, sm: 3, lg: 5 } }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          sx={{ mb: { xs: 1.5, md: 2 }, px: { md: canScroll ? 7 : 0 } }}
        >
          <Typography
            id="similar-bikes-title"
            component="h2"
            sx={{
              m: 0,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: { xs: "0.06em", sm: "0.08em" },
              fontSize: { xs: "1.25rem", sm: "1.45rem", md: "1.55rem" },
              color: NAV_BAR_BG,
              lineHeight: 1.15,
            }}
          >
            More like this
          </Typography>
          <Button
            component={RouterLink}
            to={`/shop?type=${encodeURIComponent(bike.type)}`}
            endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} aria-hidden />}
            sx={{
              flexShrink: 0,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              color: NAV_BAR_BG,
              px: 2,
              py: 0.75,
              borderRadius: "999px",
              border: "1px solid rgba(36, 61, 51, 0.35)",
              "&:hover": { bgcolor: "rgba(36, 61, 51, 0.07)", borderColor: NAV_BAR_BG },
            }}
          >
            See all {bike.type}
          </Button>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={{ md: 1.5 }}>
          {canScroll ? (
            <IconButton
              aria-label="Previous bikes"
              onClick={() => scrollByPage(-1)}
              disabled={edges.start}
              sx={arrowSx}
            >
              <ChevronLeftRoundedIcon />
            </IconButton>
          ) : null}
          <Box
            ref={scrollerRef}
            onScroll={updateEdges}
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              gap: { xs: "12px", sm: "16px", md: "20px" },
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollPaddingInline: "4px",
              // Room for the cards' hover lift and shadow, which overflow-x would otherwise clip.
              pt: 1,
              pb: 2,
              px: "4px",
              mx: "-4px",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {similar.map((b) => (
              <Box
                key={b._id}
                sx={{ flex: "0 0 auto", width: cardWidth, scrollSnapAlign: "start", display: "flex" }}
              >
                <BikeCard bike={b} />
              </Box>
            ))}
          </Box>
          {canScroll ? (
            <IconButton
              aria-label="More bikes"
              onClick={() => scrollByPage(1)}
              disabled={edges.end}
              sx={arrowSx}
            >
              <ChevronRightRoundedIcon />
            </IconButton>
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
}
