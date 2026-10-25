import { Box, Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { NAV_BAR_BG } from "utils/brandColors";

export default function NotFoundContent({
  title = "We couldn't find that page",
  body = "The link may be old or mistyped. Try the shop, or get in touch and we'll point you in the right direction.",
}) {
  return (
    <Box sx={{ maxWidth: 640, mx: "auto", px: 3, py: { xs: 8, md: 12 }, textAlign: "center" }}>
      <Typography
        component="h1"
        sx={{
          m: 0,
          fontWeight: 800,
          fontSize: { xs: "1.8rem", md: "2.2rem" },
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          color: NAV_BAR_BG,
          lineHeight: 1.1,
        }}
      >
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 2, fontSize: "1.05rem", lineHeight: 1.6 }}>
        {body}
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center" sx={{ mt: 4 }}>
        <Button
          component={RouterLink}
          to="/shop"
          variant="contained"
          disableElevation
          sx={{
            px: 3,
            py: 1.25,
            borderRadius: "10px",
            fontWeight: 700,
            textTransform: "none",
            bgcolor: NAV_BAR_BG,
            "&:hover": { bgcolor: "#1e332b" },
          }}
        >
          Browse bikes
        </Button>
        <Button
          component={RouterLink}
          to="/contact"
          variant="outlined"
          sx={{
            px: 3,
            py: 1.25,
            borderRadius: "10px",
            fontWeight: 700,
            textTransform: "none",
            color: NAV_BAR_BG,
            borderColor: "rgba(36, 61, 51, 0.4)",
            "&:hover": { borderColor: NAV_BAR_BG, bgcolor: "rgba(36, 61, 51, 0.05)" },
          }}
        >
          Contact us
        </Button>
      </Stack>
    </Box>
  );
}
