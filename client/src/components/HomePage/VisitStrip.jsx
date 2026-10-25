import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { Box, Link, Stack, Typography } from "@mui/material";
import { NAV_BAR_BG } from "components/General/NavBar";
import { useEffect, useState } from "react";
import {
  SHOP_ADDRESS,
  SHOP_DIRECTIONS_URL,
  SHOP_PHONE,
  todayHours,
} from "utils/shopHours";

const itemSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  color: "#fff",
  fontSize: { xs: "0.95rem", md: "1rem" },
  minHeight: 44,
};

const linkSx = {
  ...itemSx,
  textDecoration: "none",
  "&:hover": { textDecoration: "underline" },
  "&:focus-visible": { outline: "2px solid #fff", outlineOffset: 3, borderRadius: "4px" },
};

const iconSx = { fontSize: 22, color: "rgba(255,255,255,0.85)", flexShrink: 0 };

/** "11:00 AM" → "11 AM" */
const shortTime = (t) => String(t).replace(":00", "");

const VisitStrip = () => {
  const [today, setToday] = useState(() => todayHours());

  useEffect(() => {
    const t = setInterval(() => setToday(todayHours()), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <Box
      component="section"
      aria-label="Visit the shop"
      sx={{ bgcolor: NAV_BAR_BG, px: { xs: 2, sm: 3, md: 6, lg: 8 }, py: { xs: 1.5, md: 1.25 } }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="center"
        columnGap={{ md: 5, lg: 7 }}
        rowGap={0.25}
        sx={{ maxWidth: 1680, mx: "auto" }}
      >
        <Box sx={itemSx}>
          <AccessTimeOutlinedIcon sx={iconSx} aria-hidden />
          <Typography component="span" sx={{ fontSize: "inherit", fontWeight: 500 }}>
            {today.open
              ? `Open today ${shortTime(today.open)} to ${shortTime(today.close)}`
              : "Closed today"}
          </Typography>
          <Box
            component="span"
            sx={{
              ml: 0.5,
              flexShrink: 0,
              whiteSpace: "nowrap",
              px: 1,
              py: 0.25,
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              bgcolor: today.isOpen ? "#fff" : "rgba(255,255,255,0.16)",
              color: today.isOpen ? NAV_BAR_BG : "#fff",
            }}
          >
            {today.isOpen ? "Open now" : "Closed now"}
          </Box>
        </Box>
        <Link href={SHOP_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" sx={linkSx}>
          <PlaceOutlinedIcon sx={iconSx} aria-hidden />
          {SHOP_ADDRESS.street}, {SHOP_ADDRESS.city}
        </Link>
        <Link href={`tel:${SHOP_PHONE.tel}`} sx={linkSx}>
          <PhoneOutlinedIcon sx={iconSx} aria-hidden />
          {SHOP_PHONE.display}
        </Link>
      </Stack>
    </Box>
  );
};

export default VisitStrip;
