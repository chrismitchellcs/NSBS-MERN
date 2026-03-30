import { Box, Button, Stack, Typography } from "@mui/material";
import { NAV_BAR_BG } from "components/General/NavBar";
import { heroHeaderDeliverySrc } from "utils/heroImageUrl";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const CAROUSEL_MS = 7000;

const FALLBACK_SLIDES = [
  {
    _id: "fallback-local",
    imageUrl: "/sighttq2.jpg",
    imageAlt: "Mountain biking on the North Shore",
    headline: "NORTH SHORE BIKE SHOP",
    body: "Premium mountain bikes, expert service, and a crew that rides what they sell. Right here on the North Shore since 2007.",
    ctaLabel: "Shop bikes",
    ctaPath: "/shop",
    objectPosition: "center bottom",
  },
];

const HeaderImage = () => {
  /** `null` until the public API responds — avoids flashing fallback copy then swapping to CMS slides. */
  const [slides, setSlides] = useState(null);
  const [index, setIndex] = useState(0);
  /** Opacity transitions are off for the first paint so crossfades don’t look like duplicate text. */
  const [slideTransitionOn, setSlideTransitionOn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const url = `${process.env.REACT_APP_VERCEL_DOMAIN}/api/header-hero/public`;
    axios
      .get(url)
      .then((res) => {
        if (cancelled) return;
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
        } else {
          setSlides(FALLBACK_SLIDES);
        }
        setIndex(0);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!cancelled) setSlideTransitionOn(true);
          });
        });
      })
      .catch(() => {
        if (!cancelled) {
          setSlides(FALLBACK_SLIDES);
          setIndex(0);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (!cancelled) setSlideTransitionOn(true);
            });
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const len = slides.length;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % len);
    }, CAROUSEL_MS);
    return () => clearInterval(t);
  }, [slides]);

  useEffect(() => {
    if (!slides?.length) return;
    const len = slides.length;
    setIndex((i) => {
      if (len === 0) return 0;
      return i >= len ? 0 : i;
    });
  }, [slides]);

  /** Match image height so in-flow layout isn’t shorter than the cover image (absolute slides don’t stretch the box). */
  const heroMinHeight = {
    xs: "max(72vh, 420px)",
    md: "max(min(85vh, 48vw), 480px)",
  };
  const imgHeight = { xs: "72vh", md: "min(85vh, 48vw)" };

  if (!slides) {
    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          mb: -0.5,
          minHeight: heroMinHeight,
          bgcolor: "#1e2420",
        }}
        aria-busy="true"
        aria-label="Loading hero"
      />
    );
  }

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        mb: -0.5,
        minHeight: heroMinHeight,
      }}
    >
      {slides.map((slide, i) => (
        <Box
          key={slide._id}
          sx={{
            position: "absolute",
            inset: 0,
            opacity: i === index ? 1 : 0,
            transition:
              reducedMotion || !slideTransitionOn
                ? "none"
                : "opacity 0.85s ease-in-out",
            pointerEvents: i === index ? "auto" : "none",
            zIndex: i === index ? 1 : 0,
          }}
        >
          <Box
            component="img"
            src={heroHeaderDeliverySrc(slide.imageUrl)}
            alt={slide.imageAlt || slide.headline || "North Shore Bike Shop"}
            decoding="async"
            loading={i === index ? "eager" : "lazy"}
            sx={{
              width: "100%",
              height: imgHeight,
              minHeight: { xs: 420, md: 480 },
              objectFit: "cover",
              objectPosition: slide.objectPosition || "center bottom",
              display: "block",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              bgcolor: "rgba(0,0,0,0.32)",
            }}
          />
          <Stack
            sx={{
              position: "absolute",
              left: 0,
              right: { xs: 0, md: "auto" },
              top: { xs: 0, md: "90px" },
              bottom: 0,
              zIndex: 10,
              justifyContent: "flex-end",
              px: { xs: 3, sm: 4, md: 6, lg: 8 },
              pb: { xs: 5, md: 7 },
              pt: { xs: 10, md: 0 },
              maxWidth: { md: "min(760px, 64vw)" },
              textAlign: { xs: "center", md: "left" },
              alignItems: { xs: "center", md: "flex-start" },
            }}
            spacing={{ xs: 1.5, md: 2 }}
          >
            <Typography
              component="h1"
              sx={{
                m: 0,
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: { xs: "-0.02em", md: "-0.03em" },
                color: "#fff",
                fontSize: {
                  xs: "2.35rem",
                  sm: "2.85rem",
                  md: "clamp(2.1rem, 3.5vw, 3.15rem)",
                },
                textTransform: "uppercase",
              }}
            >
              {slide.headline}
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.92)",
                fontWeight: 400,
                fontSize: { xs: "1rem", md: "1.125rem" },
                lineHeight: 1.5,
                maxWidth: 460,
              }}
            >
              {slide.body}
            </Typography>
            <Button
              component={RouterLink}
              to={
                slide.ctaPath?.startsWith("/")
                  ? slide.ctaPath
                  : `/${slide.ctaPath || "shop"}`
              }
              variant="contained"
              disableElevation
              sx={{
                mt: { xs: 1, md: 1.5 },
                px: 3,
                py: 1.25,
                borderRadius: "10px",
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.06em",
                bgcolor: "#fff",
                color: "#1a1a1a",
                "&:hover": {
                  bgcolor: NAV_BAR_BG,
                  color: "#fff",
                },
              }}
            >
              {slide.ctaLabel || "Shop"}
            </Button>
          </Stack>
        </Box>
      ))}

      {slides.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: { xs: 24, md: 28 },
            zIndex: 20,
            justifyContent: "center",
            pointerEvents: "auto",
          }}
        >
          {slides.map((s, i) => (
            <Box
              key={s._id}
              component="button"
              type="button"
              aria-label={`Show slide ${i + 1} of ${slides.length}`}
              onClick={() => setIndex(i)}
              sx={{
                width: 10,
                height: 10,
                p: 0,
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                bgcolor: i === index ? "#fff" : "rgba(255,255,255,0.35)",
                transition: "background-color 0.2s",
                "&:hover": {
                  bgcolor: i === index ? "#fff" : "rgba(255,255,255,0.55)",
                },
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default HeaderImage;
