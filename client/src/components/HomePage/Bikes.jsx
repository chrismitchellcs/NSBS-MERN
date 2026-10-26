import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Box, Button, IconButton, Stack, Typography, useMediaQuery } from "@mui/material";
import BikeCard from "components/Shop/BikeCard";
import { useMemo, useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link as RouterLink } from "react-router-dom";
import { brandPath } from "seo/seoData.mjs";
import { getBikeFirstImageUrl } from "utils/bikeDisplay";

/** Matches NavBar / site green */
const BRAND_GREEN = "#243d33";

/** Matches horizontal padding on each carousel slide (theme spacing) */
const SLIDE_GUTTER = 1;

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 1200 },
    items: 4,
    slidesToSlide: 4,
  },
  desktopSmall: {
    breakpoint: { max: 1200, min: 860 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 860, min: 599 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 599, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const arrowSx = {
  flexShrink: 0,
  width: { xs: 36, sm: 44 },
  height: { xs: 36, sm: 44 },
  color: BRAND_GREEN,
  bgcolor: "#fff",
  border: "1px solid rgba(36, 61, 51, 0.25)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  "&:hover": { bgcolor: BRAND_GREEN, color: "#fff", borderColor: BRAND_GREEN },
};

const Bikes = ({ brand, bikes }) => {
  const carouselRef = useRef(null);
  const list = useMemo(
    () =>
      (bikes ?? [])
        .filter(
          (b) =>
            b.brand?.toLowerCase() === (brand ?? "").toLowerCase() &&
            getBikeFirstImageUrl(b),
        )
        .slice(0, 20),
    [bikes, brand],
  );

  const isSingle = list.length === 1;

  const fits4 = useMediaQuery("(min-width:1200px)", { noSsr: true });
  const fits3 = useMediaQuery("(min-width:860px)", { noSsr: true });
  const fits2 = useMediaQuery("(min-width:599px)", { noSsr: true });
  const visibleCount = fits4 ? 4 : fits3 ? 3 : fits2 ? 2 : 1;
  const showArrows = list.length > visibleCount;

  return (
    <Box
      component="section"
      aria-label={`${brand ?? "Featured"} bikes`}
      sx={{
        bgcolor: "#fff",
        pt: { xs: 3, md: 4 },
        pb: { xs: 1.5, md: 2 },
        px: { xs: 1.5, sm: 2, md: 2.5 },
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        justifyContent={{
          xs: "center",
          sm: isSingle ? "center" : "space-between",
        }}
        spacing={2}
        sx={{
          maxWidth: 1680,
          mx: "auto",
          mb: { xs: 2, md: 2.25 },
          pl: { xs: 0, sm: isSingle ? 0 : SLIDE_GUTTER },
        }}
      >
        <Typography
          component="h2"
          sx={{
            m: 0,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: { xs: "0.06em", sm: "0.08em" },
            fontSize: { xs: "1.3rem", sm: "1.45rem", md: "1.6rem" },
            color: BRAND_GREEN,
            lineHeight: 1.15,
            textAlign: {
              xs: "center",
              sm: isSingle ? "center" : "left",
            },
            width: { xs: "100%", sm: isSingle ? "auto" : "auto" },
          }}
        >
          Shop {brand} bikes
        </Typography>
        <Button
          component={RouterLink}
          to={brand ? brandPath(brand) : "/shop"}
          endIcon={
            <ArrowForwardIcon sx={{ fontSize: 20 }} aria-hidden />
          }
          sx={{
            flexShrink: 0,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            letterSpacing: "0.02em",
            color: BRAND_GREEN,
            px: 2.25,
            py: 1,
            borderRadius: "999px",
            border: "1px solid rgba(36, 61, 51, 0.35)",
            "&:hover": {
              bgcolor: "rgba(36, 61, 51, 0.07)",
              borderColor: BRAND_GREEN,
            },
          }}
        >
          See all
        </Button>
      </Stack>

      <Box sx={{ maxWidth: 1680, mx: "auto" }}>
        {list.length > 0 ? (
          isSingle ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                px: SLIDE_GUTTER,
              }}
            >
              <BikeCard bike={list[0]} embedInCarousel />
            </Box>
          ) : (
            <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1, md: 1.5 }}>
              {showArrows ? (
                <IconButton
                  aria-label={`Previous ${brand} bikes`}
                  onClick={() => carouselRef.current?.previous()}
                  sx={arrowSx}
                >
                  <ChevronLeftRoundedIcon />
                </IconButton>
              ) : null}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Carousel
                  ref={carouselRef}
                  arrows={false}
                  swipeable
                  draggable={false}
                  showDots={false}
                  responsive={responsive}
                  ssr={false}
                  infinite
                  autoPlay={false}
                  autoPlaySpeed={5000}
                  keyBoardControl={false}
                  customTransition="transform 500ms ease-in-out"
                  transitionDuration={500}
                  containerClass="carousel-container"
                  itemClass="carousel-item-padding-40-px"
                >
                  {list.map((bike) => (
                    <Box
                      key={bike._id}
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "center", sm: "flex-start" },
                        width: "100%",
                        px: SLIDE_GUTTER,
                      }}
                    >
                      <BikeCard bike={bike} embedInCarousel />
                    </Box>
                  ))}
                </Carousel>
              </Box>
              {showArrows ? (
                <IconButton
                  aria-label={`Next ${brand} bikes`}
                  onClick={() => carouselRef.current?.next()}
                  sx={arrowSx}
                >
                  <ChevronRightRoundedIcon />
                </IconButton>
              ) : null}
            </Stack>
          )
        ) : (
          <Typography
            sx={{
              textAlign: "center",
              py: 5,
              color: "text.secondary",
              fontSize: "1rem",
              maxWidth: 480,
              mx: "auto",
            }}
          >
            No {brand} bikes in the gallery right now. Visit the shop or check
            back soon.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Bikes;
