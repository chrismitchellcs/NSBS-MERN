import { Box, Button, Stack, Typography } from "@mui/material";
import { NAV_BAR_BG } from "components/General/NavBar";
import { Link as RouterLink } from "react-router-dom";

/**
 * Full-bleed brand story block: photo, gradient scrim, logo, copy, shop CTA.
 * @param {object} props
 * @param {string} props.imageSrc
 * @param {string} [props.imageAlt]
 * @param {string|import("@mui/system").ResponsiveStyleValue<string>} props.imageObjectPosition
 * @param {string} props.logoSrc
 * @param {string} [props.logoAlt]
 * @param {import("@mui/system").SxProps} [props.logoSx]
 * @param {"left"|"right"} props.align — content side on md+
 * @param {string} props.eyebrow
 * @param {string} props.description
 * @param {string} props.shopBrand — passed to /shop as location.state.brand
 */
export default function BrandStoryBand({
  imageSrc,
  imageAlt = "",
  imageObjectPosition = "center",
  logoSrc,
  logoAlt = "",
  logoSx = {},
  align = "left",
  eyebrow,
  description,
  shopBrand,
}) {
  const isRight = align === "right";

  const overlayGradient = {
    xs: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.42) 45%, rgba(0,0,0,0.18) 100%)",
    md: isRight
      ? "linear-gradient(270deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.34) 34%, rgba(0,0,0,0.12) 52%, transparent 72%)"
      : "linear-gradient(90deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.34) 34%, rgba(0,0,0,0.12) 52%, transparent 72%)",
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        mb: -0.5,
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        alt={imageAlt}
        sx={{
          width: "100%",
          height: { xs: "min(80vh, 820px)", md: "clamp(380px, 45vw, 720px)" },
          minHeight: { xs: 320, md: 400 },
          objectFit: "cover",
          objectPosition: imageObjectPosition,
          display: "block",
        }}
        loading="lazy"
        decoding="async"
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: overlayGradient,
        }}
      />
      <Stack
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          justifyContent: { xs: "flex-end", md: "center" },
          alignItems: {
            xs: "center",
            md: isRight ? "flex-end" : "flex-start",
          },
          px: { xs: 2, sm: 3, md: 6, lg: 8 },
          pb: { xs: 4, md: 0 },
          pt: { xs: 6, md: 0 },
          textAlign: { xs: "center", md: isRight ? "right" : "left" },
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: "min(100%, 520px)", md: "min(580px, 46vw)" },
            width: "100%",
          }}
        >
          <Stack spacing={{ xs: 1.75, md: 2.25 }}>
            <Typography
              variant="overline"
              sx={{
                color: "rgba(255,255,255,0.88)",
                letterSpacing: "0.22em",
                fontWeight: 600,
                fontSize: "0.72rem",
                alignSelf: { xs: "center", md: isRight ? "flex-end" : "flex-start" },
              }}
            >
              {eyebrow}
            </Typography>
            <Box
              component="img"
              src={logoSrc}
              alt={logoAlt}
              sx={{
                display: "block",
                height: "auto",
                alignSelf: { xs: "center", md: isRight ? "flex-end" : "flex-start" },
                width: { xs: "min(88%, 340px)", md: "min(100%, 400px)" },
                maxWidth: "100%",
                ...logoSx,
              }}
            />
            <Typography
              sx={{
                m: 0,
                color: "rgba(255,255,255,0.92)",
                fontWeight: 400,
                fontSize: { xs: "1rem", md: "1.0625rem" },
                lineHeight: 1.65,
                maxWidth: 540,
                alignSelf: { xs: "center", md: isRight ? "flex-end" : "flex-start" },
              }}
            >
              {description}
            </Typography>
            <Box
              sx={{
                alignSelf: { xs: "center", md: isRight ? "flex-end" : "flex-start" },
                pt: 0.5,
              }}
            >
              <Button
                component={RouterLink}
                to="/shop"
                state={{ brand: shopBrand }}
                variant="contained"
                disableElevation
                sx={{
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
                Shop {shopBrand}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
