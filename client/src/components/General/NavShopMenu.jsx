import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  ClickAwayListener,
  Fade,
  Link,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
import { getAllBikesCached } from "api/getAllBikesCached";
import { NAV_BAR_BG } from "utils/brandColors";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { SHOP_BRANDS, SHOP_TYPES } from "utils/shopFilters";

const CLOSE_DELAY_MS = 150;

const headingSx = {
  display: "block",
  color: "text.secondary",
  letterSpacing: "0.12em",
  fontWeight: 700,
  fontSize: "0.68rem",
  textTransform: "uppercase",
  mb: 1,
};

const linkSx = {
  display: "block",
  py: 0.6,
  color: "text.primary",
  fontSize: "0.95rem",
  textDecoration: "none",
  borderRadius: 1,
  "&:hover": { color: NAV_BAR_BG, textDecoration: "underline" },
  "&:focus-visible": { outline: `2px solid ${NAV_BAR_BG}`, outlineOffset: 2 },
};

/** Desktop "Shop" with a panel of shortcuts into the filtered shop (brand, type, deals). */
export default function NavShopMenu({ buttonSx }) {
  const [open, setOpen] = useState(false);
  const [bikes, setBikes] = useState(null);
  const anchorRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    getAllBikesCached()
      .then(setBikes)
      .catch(() => setBikes(null));
  }, []);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  /** Hide types with no bikes on the site right now (all shown until bikes load). */
  const types = useMemo(() => {
    if (!Array.isArray(bikes)) return SHOP_TYPES;
    const present = new Set(bikes.map((b) => b.type));
    return SHOP_TYPES.filter((t) => present.has(t));
  }, [bikes]);

  const openNow = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };
  const close = () => {
    clearTimeout(closeTimer.current);
    setOpen(false);
  };

  const menuLink = (to, label) => (
    <Link component={RouterLink} to={to} onClick={close} sx={linkSx}>
      {label}
    </Link>
  );

  return (
    <Box
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") openNow();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") closeSoon();
      }}
      sx={{ display: "inline-flex" }}
    >
      <Button
        ref={anchorRef}
        component={RouterLink}
        to="/shop"
        onClick={close}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            openNow();
          } else if (e.key === "Escape") {
            close();
          }
        }}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="nav-shop-menu"
        endIcon={
          <ExpandMoreIcon
            sx={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}
          />
        }
        sx={buttonSx}
      >
        Shop
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        transition
        modifiers={[{ name: "offset", options: { offset: [0, 10] } }]}
        sx={{ zIndex: (t) => t.zIndex.modal }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={150}>
            <Paper
              id="nav-shop-menu"
              elevation={8}
              onMouseEnter={openNow}
              onMouseLeave={closeSoon}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  close();
                  anchorRef.current?.focus();
                }
              }}
              sx={{ borderRadius: 2, p: 2.5, minWidth: 460 }}
            >
              <ClickAwayListener onClickAway={close}>
                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography component="span" sx={headingSx}>
                      Brands
                    </Typography>
                    {SHOP_BRANDS.map((b) => (
                      <Box key={b}>{menuLink(`/shop/${b.toLowerCase()}`, b)}</Box>
                    ))}
                  </Box>
                  <Box>
                    <Typography component="span" sx={headingSx}>
                      Bike types
                    </Typography>
                    {types.map((t) => (
                      <Box key={t}>{menuLink(`/shop?type=${encodeURIComponent(t)}`, t)}</Box>
                    ))}
                  </Box>
                  <Box>
                    <Typography component="span" sx={headingSx}>
                      More
                    </Typography>
                    {menuLink("/shop", "All bikes")}
                    {menuLink("/shop?sale=1", "On sale")}
                  </Box>
                </Stack>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
}
