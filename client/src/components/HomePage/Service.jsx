import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const BRAND_GREEN = "#243d33";

const sectionCtaSx = {
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
};

const Service = () => {
  return (
    <Box component="section" aria-label="Bike service" sx={{ bgcolor: "#fff" }}>
      <Box
        component="img"
        src="IMG_1090.jpg"
        alt="North Shore Bike Shop service department"
        sx={{
          width: "100%",
          display: "block",
          height: { xs: "min(52vw, 360px)", sm: "min(48vw, 420px)", md: "min(40vw, 480px)" },
          minHeight: { xs: 220, md: 280 },
          objectFit: "cover",
          objectPosition: "center",
        }}
        loading="lazy"
        decoding="async"
      />
      <Box
        sx={{
          maxWidth: 1680,
          mx: "auto",
          px: { xs: 1.5, sm: 2, md: 2.5 },
          pt: { xs: 2.5, md: 3 },
          pb: { xs: 2, md: 2.5 },
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
          sx={{ mb: { xs: 1.5, md: 2 } }}
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
              textAlign: "center",
            }}
          >
            Service
          </Typography>
          <Button
            component={RouterLink}
            to="/service"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 20 }} aria-hidden />}
            sx={sectionCtaSx}
          >
            More info
          </Button>
        </Stack>
        <Typography
          sx={{
            m: 0,
            maxWidth: 720,
            mx: "auto",
            textAlign: "center",
            fontSize: { xs: "1rem", md: "1.0625rem" },
            lineHeight: 1.65,
            color: "rgba(0,0,0,0.78)",
            fontWeight: 400,
          }}
        >
          Experience our service department, where tidiness, speed, and competent
          mechanics are guaranteed to get you back on your bike quickly. Our
          unmatched turn-around time and expertise ensure that we fix everything
          bicycle-related, making us your go-to shop in town.
        </Typography>
      </Box>
    </Box>
  );
};

export default Service;
