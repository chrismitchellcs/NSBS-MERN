import DirectionsOutlinedIcon from "@mui/icons-material/DirectionsOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { Box, Button, Stack, Typography } from "@mui/material";
import { StatusDot, useShopStatus } from "components/General/NavShopStatus";
import { NAV_BAR_BG } from "utils/brandColors";
import { SHOP_ADDRESS, SHOP_DIRECTIONS_URL, SHOP_PHONE } from "utils/shopHours";

/** Photo hero: first come, first served, with directions and a call button for ETAs. */
const ServiceHero = () => {
  const status = useShopStatus();

  return (
    <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <Box
        component="img"
        src="/IMG_1090-min.jpg"
        alt="North Shore Bike Shop service department"
        sx={{
          width: "100%",
          display: "block",
          height: { xs: "min(78vh, 560px)", md: "min(46vw, 600px)" },
          minHeight: { xs: 460, md: 420 },
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background: {
            xs: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.2) 100%)",
            md: "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.1) 80%)",
          },
        }}
      />
      <Stack
        spacing={{ xs: 1.75, md: 2.25 }}
        sx={{
          position: "absolute",
          inset: 0,
          justifyContent: { xs: "flex-end", md: "center" },
          px: { xs: 2.5, sm: 4, md: 6, lg: 8 },
          pb: { xs: 4, md: 0 },
          maxWidth: { md: 640 },
          color: "#fff",
        }}
      >
        <Typography
          component="h1"
          sx={{
            m: 0,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "0.015em",
            textTransform: "uppercase",
            fontSize: { xs: "2.2rem", sm: "2.6rem", md: "clamp(2.4rem, 3.6vw, 3.2rem)" },
          }}
        >
          Bike service & repair
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.92)", fontSize: { xs: "1rem", md: "1.1rem" }, lineHeight: 1.6, maxWidth: 520 }}>
          Our mechanics ride the Shore and know these bikes inside and out. Bring yours in any
          time we&apos;re open and we&apos;ll take it first come, first served. Call or email if
          you want an idea of timing.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ pt: 0.5 }}>
          <Button
            href={SHOP_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            disableElevation
            startIcon={<DirectionsOutlinedIcon />}
            sx={{
              px: 3,
              py: 1.25,
              borderRadius: "10px",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "1rem",
              bgcolor: "#fff",
              color: "#1a1a1a",
              "&:hover": { bgcolor: NAV_BAR_BG, color: "#fff" },
            }}
          >
            Get directions
          </Button>
          <Button
            href={`tel:${SHOP_PHONE.tel}`}
            variant="outlined"
            startIcon={<PhoneOutlinedIcon />}
            sx={{
              px: 3,
              py: 1.25,
              borderRadius: "10px",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "1rem",
              color: "#fff",
              borderColor: "rgba(255,255,255,0.6)",
              "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            Call {SHOP_PHONE.display}
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem" }}>
          <StatusDot isOpen={status.isOpen} />
          <span>
            {status.label}, {SHOP_ADDRESS.street}
          </span>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ServiceHero;
