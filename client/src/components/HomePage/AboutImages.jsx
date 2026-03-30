import { Box, Button, Fade, Stack, Typography } from "@mui/material";
import { NAV_BAR_BG } from "components/General/NavBar";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const cards = [
  {
    title: "Shop mountain bikes",
    description: "Premium bikes from Transition, Norco, and Ibis.",
    buttonText: "Shop bikes",
    image: "xtr.jpg",
    link: "/shop",
  },
  {
    title: "Expert bike service",
    description: "Fast turnaround and mechanics who ride.",
    buttonText: "Service info",
    image: "IMG_1090-min.jpg",
    link: "/service",
  },
  {
    title: "Visit our shop",
    description: "North Vancouver, BC — right on the Shore.",
    buttonText: "Contact us",
    image: "bottlerocket.jpg",
    link: "/contact",
  },
];

const AboutImages = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Box
      component="section"
      aria-label="Shop highlights"
      sx={{
        bgcolor: "#f6f7f6",
        py: { xs: 2, sm: 2.5, md: 3 },
        px: { xs: 1.5, sm: 2, md: 2.5 },
      }}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={{ xs: 1.5, md: 2 }}
        sx={{
          maxWidth: "100%",
          mx: 0,
          alignItems: "stretch",
        }}
      >
        {cards.map((card, i) => (
          <Fade key={card.title} in={show} timeout={500 + i * 160}>
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                aspectRatio: { xs: "16/10", lg: "4/3" },
                minHeight: {
                  xs: 320,
                  sm: 380,
                  md: 400,
                  lg: "min(52vw, 560px)",
                },
                boxShadow: "0 14px 44px rgba(0,0,0,0.12)",
                "&:hover .about-card-img": {
                  transform: "scale(1.08)",
                },
                "@media (prefers-reduced-motion: reduce)": {
                  "&:hover .about-card-img": { transform: "scale(1)" },
                  "& .about-card-img": { transition: "none" },
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  zIndex: 0,
                }}
              >
                <Box
                  component="img"
                  className="about-card-img"
                  src={card.image}
                  alt={card.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                    transform: "scale(1)",
                    transformOrigin: "center center",
                    transition:
                      "transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                  loading="lazy"
                  decoding="async"
                />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 1,
                  pointerEvents: "none",
                  bgcolor: "rgba(0,0,0,0.32)",
                }}
              />
              <Stack
                spacing={{ xs: 1.1, md: 1.25 }}
                sx={{
                  position: "absolute",
                  left: 0,
                  right: { xs: 0, md: "auto" },
                  bottom: 0,
                  zIndex: 2,
                  maxWidth: { md: "92%" },
                  p: { xs: 2.25, sm: 2.5, md: 3 },
                  textAlign: { xs: "center", md: "left" },
                  alignItems: { xs: "center", md: "flex-start" },
                }}
              >
                <Typography
                  component="h2"
                  sx={{
                    m: 0,
                    fontWeight: 800,
                    lineHeight: 1.05,
                    letterSpacing: { xs: "-0.02em", md: "-0.03em" },
                    color: "#fff",
                    fontSize: {
                      xs: "1.65rem",
                      sm: "1.85rem",
                      md: "clamp(1.6rem, 2.2vw, 2.05rem)",
                    },
                    textTransform: "uppercase",
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  sx={{
                    m: 0,
                    color: "rgba(255,255,255,0.92)",
                    fontWeight: 400,
                    fontSize: { xs: "1.02rem", md: "1.08rem" },
                    lineHeight: 1.5,
                    maxWidth: 400,
                  }}
                >
                  {card.description}
                </Typography>
                <Button
                  component={RouterLink}
                  to={card.link}
                  variant="contained"
                  disableElevation
                  sx={{
                    mt: { xs: 0.35, md: 0.5 },
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
                  {card.buttonText}
                </Button>
              </Stack>
            </Box>
          </Fade>
        ))}
      </Stack>
    </Box>
  );
};

export default AboutImages;
