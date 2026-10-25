import DirectionsOutlinedIcon from "@mui/icons-material/DirectionsOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { Box, Button, Link, Popover, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { NAV_BAR_BG } from "utils/brandColors";
import {
  SHOP_ADDRESS,
  SHOP_DIRECTIONS_URL,
  SHOP_PHONE,
  shopHoursSummary,
  shopStatus,
} from "utils/shopHours";

/** Re-evaluates every minute so "Open until 7 PM" flips to closed on time. */
export function useShopStatus() {
  const [status, setStatus] = useState(() => shopStatus());
  useEffect(() => {
    const t = setInterval(() => setStatus(shopStatus()), 60000);
    return () => clearInterval(t);
  }, []);
  return status;
}

export function StatusDot({ isOpen }) {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        flexShrink: 0,
        bgcolor: isOpen ? "#4ade80" : "rgba(255,255,255,0.45)",
        boxShadow: isOpen ? "0 0 0 3px rgba(74,222,128,0.25)" : "none",
      }}
    />
  );
}

/** Desktop pill: "● Open until 7 PM" → popover with hours, call, directions. */
export default function NavShopStatus({ buttonSx }) {
  const status = useShopStatus();
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-haspopup="dialog"
        aria-expanded={Boolean(anchorEl)}
        sx={{ ...buttonSx, gap: 1, whiteSpace: "nowrap" }}
      >
        <StatusDot isOpen={status.isOpen} />
        <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
          {status.label}
        </Box>
        <Box component="span" sx={{ display: { xs: "inline", lg: "none" } }}>
          {status.isOpen ? "Open" : "Closed"}
        </Box>
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { mt: 1.25, borderRadius: 2, p: 2.25, width: 300 } } }}
      >
        <Typography sx={{ fontWeight: 700, mb: 0.25 }}>{status.label}</Typography>
        <Typography variant="body2" color="text.secondary">
          {shopHoursSummary()}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {SHOP_ADDRESS.street}, {SHOP_ADDRESS.city}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            href={`tel:${SHOP_PHONE.tel}`}
            variant="contained"
            disableElevation
            size="small"
            startIcon={<PhoneOutlinedIcon />}
            sx={{ textTransform: "none", fontWeight: 600, bgcolor: NAV_BAR_BG, "&:hover": { bgcolor: "#1e332b" } }}
          >
            Call
          </Button>
          <Button
            href={SHOP_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            size="small"
            startIcon={<DirectionsOutlinedIcon />}
            sx={{ textTransform: "none", fontWeight: 600, color: NAV_BAR_BG, borderColor: NAV_BAR_BG }}
          >
            Directions
          </Button>
        </Stack>
        <Link
          component={RouterLink}
          to="/contact"
          onClick={() => setAnchorEl(null)}
          sx={{ display: "inline-block", mt: 1.5, fontSize: "0.875rem", color: NAV_BAR_BG }}
        >
          Contact & full hours
        </Link>
      </Popover>
    </>
  );
}
