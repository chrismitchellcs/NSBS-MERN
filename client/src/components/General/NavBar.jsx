import CloseIcon from "@mui/icons-material/Close";
import DirectionsOutlinedIcon from "@mui/icons-material/DirectionsOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import MenuIcon from "@mui/icons-material/Menu";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "components/AuthProvider";
import NavBarGlobalSearch from "components/General/NavBarGlobalSearch";
import NavShopMenu from "components/General/NavShopMenu";
import NavShopStatus, { StatusDot, useShopStatus } from "components/General/NavShopStatus";
import { NAV_BAR_BG } from "utils/brandColors";
import { SHOP_DIRECTIONS_URL, SHOP_PHONE } from "utils/shopHours";

export { NAV_BAR_BG };

const INSTAGRAM_URL = "https://www.instagram.com/north_shore_bike_shop/";

/** Only force bar visible when essentially at document top (avoids layout-shift loops with hide/show). */
const SCROLL_PIN_OPEN_PX = 20;
/** Min scroll delta to change hide state — higher = less jitter when scrolling slowly. */
const SCROLL_DELTA_HIDE = 14;
const SCROLL_DELTA_SHOW = 12;
/** Home `background="transparent"`: glass bar only while scroll is within this many px of top */
const TRANSPARENT_NAV_UNTIL = 24;
/** Past this scroll offset the bar gets its translucent "scrolled" look. */
const SCROLLED_PX = 8;

const NavBar = ({
  background = NAV_BAR_BG,
  position,
  displayLogo,
  aboveDrawer = false,
  variant,
  logoSize = "default",
  hideOnScroll = true,
  /** Optional: parent notified when hide-on-scroll toggles (e.g. analytics). */
  onBarsHiddenChange,
}) => {
  const { pathname } = useLocation();
  const theme = useTheme();
  /** Full link layout from md (900px); below that, menu + search icons. */
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrollHidden, setScrollHidden] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const lastScrollY = useRef(0);
  /** After a hide/show transition, ignore scroll-driven toggles briefly (layout / subpixel jitter). */
  const scrollHideCooldownUntil = useRef(0);
  const { isAuthenticated, logout } = useAuth();
  const shopStatus = useShopStatus();

  const isAdminGray = background === "#F5F5F5";
  const scrolled = scrollTop > SCROLLED_PX;

  /** Glass over hero at top only; scrolled home uses the same green as other pages */
  const barIsGlass =
    variant !== "solid" &&
    ((background === "transparent" && scrollTop < TRANSPARENT_NAV_UNTIL) ||
      (variant === "overlay" && background !== "transparent"));

  /** White logo + light search pill everywhere except admin toolbar */
  const useLightChrome = !isAdminGray;

  /** Phones hide the bar while scrolling down; desktop always keeps it. */
  const visuallyHidden =
    hideOnScroll &&
    !isDesktop &&
    scrollHidden &&
    !menuOpen &&
    !searchOpen &&
    position !== "static";

  useEffect(() => {
    onBarsHiddenChange?.(visuallyHidden);
  }, [visuallyHidden, onBarsHiddenChange]);

  useEffect(() => {
    setScrollHidden(false);
    setMenuOpen(false);
    setSearchOpen(false);
    scrollHideCooldownUntil.current = 0;
    const y = typeof window !== "undefined" ? window.scrollY : 0;
    lastScrollY.current = y;
    setScrollTop(y);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollTop(y);

      if (position === "static" || !hideOnScroll) return;

      if (menuOpen || searchOpen) {
        lastScrollY.current = y;
        return;
      }

      if (Date.now() < scrollHideCooldownUntil.current) {
        lastScrollY.current = y;
        return;
      }

      const prev = lastScrollY.current;
      const diff = y - prev;

      setScrollHidden((wasHidden) => {
        let next = wasHidden;
        if (y <= SCROLL_PIN_OPEN_PX) next = false;
        else if (diff > SCROLL_DELTA_HIDE) next = true;
        else if (diff < -SCROLL_DELTA_SHOW) next = false;
        if (next !== wasHidden) {
          scrollHideCooldownUntil.current = Date.now() + 380;
        }
        return next;
      });
      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideOnScroll, menuOpen, searchOpen, position]);

  const closeMenu = () => setMenuOpen(false);

  const navItemIsActive = (to) => {
    if (to === "/shop") return pathname.startsWith("/shop");
    if (to === "/service") return pathname.startsWith("/service");
    if (to === "/contact") return pathname.startsWith("/contact");
    if (to === "/admin-dashboard") return pathname.startsWith("/admin-dashboard");
    return false;
  };

  /** Pill hover + optional active fill (matches global search treatment) */
  const linkButtonSx = (to) => {
    const active = to ? navItemIsActive(to) : false;
    return {
      textTransform: "none",
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      fontSize: "0.9375rem",
      letterSpacing: "0.01em",
      minWidth: 0,
      px: 1.75,
      py: 0.65,
      borderRadius: "999px",
      maxHeight: 40,
      mx: 0,
      transition: (t) =>
        t.transitions.create(["background-color", "color"], { duration: 180 }),
      color: useLightChrome ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.85)",
      textDecoration: "none",
      "&:focus-visible": {
        outline: `2px solid ${useLightChrome ? "#fff" : NAV_BAR_BG}`,
        outlineOffset: 2,
      },
      ...(useLightChrome
        ? {
            ...(active && { bgcolor: "rgba(255,255,255,0.18)", color: "#fff" }),
            "&:hover": {
              textDecoration: "none",
              bgcolor: active ? "rgba(255,255,255,0.24)" : "rgba(255,255,255,0.12)",
              color: "#fff",
            },
          }
        : {
            ...(active && { bgcolor: "rgba(0,0,0,0.07)" }),
            "&:hover": {
              textDecoration: "none",
              bgcolor: active ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.05)",
              color: "rgba(0,0,0,0.92)",
            },
          }),
    };
  };

  const logoutButtonSx = {
    ...linkButtonSx(null),
    border: "1px solid",
    borderColor: useLightChrome ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.22)",
    "&:hover": {
      bgcolor: useLightChrome ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.05)",
      borderColor: useLightChrome ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)",
    },
  };

  const iconButtonSx = {
    color: useLightChrome ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.87)",
    width: 44,
    height: 44,
    "&:hover": {
      backgroundColor: useLightChrome ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
    },
  };

  const logoWidths =
    logoSize === "compact" ? { xs: 64, sm: 76, md: 96 } : { xs: 84, sm: 96, md: 110 };

  const zBar = (t) => (aboveDrawer ? t.zIndex.drawer + 1 : t.zIndex.appBar);

  const wrapperSx =
    position === "sticky"
      ? {
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: zBar,
          overflow: visuallyHidden ? "hidden" : "visible",
          maxHeight: visuallyHidden ? 0 : 160,
          opacity: visuallyHidden ? 0 : 1,
          transition: (t) => t.transitions.create(["max-height", "opacity"], { duration: 240 }),
          pointerEvents: visuallyHidden ? "none" : "auto",
        }
      : {
          position,
          top: position === "fixed" || position === "absolute" ? 0 : undefined,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: zBar,
          transform: visuallyHidden ? "translateY(-100%)" : "translateY(0)",
          transition: (t) => t.transitions.create("transform", { duration: 220 }),
          pointerEvents: visuallyHidden ? "none" : "auto",
        };

  /** Solid at the top of the page; translucent green with blur and a soft shadow once scrolled. */
  const barSx = barIsGlass
    ? {
        backgroundColor: "transparent",
        backgroundImage: "none",
        borderBottom: "1px solid rgba(255,255,255,0.2)",
      }
    : isAdminGray
    ? { backgroundColor: background, borderBottom: "1px solid #e0e0e0" }
    : scrolled
    ? {
        backgroundColor: "rgba(36, 61, 51, 0.9)",
        backdropFilter: "saturate(140%) blur(10px)",
        WebkitBackdropFilter: "saturate(140%) blur(10px)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.14)",
      }
    : { backgroundColor: NAV_BAR_BG };

  const drawerTextColor = useLightChrome ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.87)";
  const drawerMutedColor = useLightChrome ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.55)";
  const drawerItemSx = {
    py: 1.75,
    px: 2.5,
    mx: 1,
    mb: 0.5,
    borderRadius: 2,
    color: drawerTextColor,
    "&.Mui-selected": {
      bgcolor: useLightChrome ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.06)",
    },
    "&.Mui-selected:hover": {
      bgcolor: useLightChrome ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.08)",
    },
    "&:hover": {
      bgcolor: useLightChrome ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
    },
  };
  const contactRowSx = {
    display: "flex",
    alignItems: "center",
    gap: 1.25,
    minHeight: 44,
    color: drawerTextColor,
    textDecoration: "none",
    fontSize: "0.95rem",
    "&:hover": { textDecoration: "underline" },
  };

  return (
    <Box sx={wrapperSx}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          width: "100%",
          boxShadow: "none",
          transition: (t) =>
            t.transitions.create(["background-color", "box-shadow", "border-color"], {
              duration: 200,
            }),
          ...barSx,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            maxWidth: 1400,
            width: "100%",
            mx: "auto",
            my: 1,
            px: { xs: 1, sm: 2 },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={{ xs: 2, md: 3 }} sx={{ flexShrink: 0 }}>
            {displayLogo ? (
              <Button
                component={RouterLink}
                to="/"
                sx={{ minWidth: 0, p: 0.5 }}
                aria-label="North Shore Bike Shop home"
              >
                <Box
                  component="img"
                  src={useLightChrome ? "/logowhitehq.png" : "/logo.png"}
                  alt=""
                  sx={{
                    width: logoWidths,
                    height: "auto",
                    display: "block",
                    transition: "width 0.2s ease",
                  }}
                />
              </Button>
            ) : null}

            {isDesktop ? (
              <Stack direction="row" alignItems="center" spacing={0.5} component="nav" aria-label="Main">
                <NavShopMenu buttonSx={linkButtonSx("/shop")} />
                <Button component={RouterLink} to="/service" sx={linkButtonSx("/service")}>
                  Service
                </Button>
                <Button component={RouterLink} to="/contact" sx={linkButtonSx("/contact")}>
                  Contact
                </Button>
                {isAuthenticated ? (
                  <>
                    <Button
                      component={RouterLink}
                      to="/admin-dashboard"
                      sx={linkButtonSx("/admin-dashboard")}
                    >
                      Admin
                    </Button>
                    <Button type="button" onClick={() => void logout()} sx={logoutButtonSx}>
                      Log out
                    </Button>
                  </>
                ) : null}
              </Stack>
            ) : null}
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0, ml: "auto" }}>
            {isDesktop ? (
              <>
                <Box sx={{ width: { md: 220, lg: 260 }, minWidth: 0 }}>
                  <NavBarGlobalSearch isOverlay={useLightChrome} />
                </Box>
                <NavShopStatus buttonSx={linkButtonSx(null)} />
              </>
            ) : (
              <>
                <IconButton
                  onClick={() => setSearchOpen(true)}
                  sx={iconButtonSx}
                  aria-label="Search bikes"
                >
                  <SearchIcon />
                </IconButton>
                <IconButton
                  onClick={() => setMenuOpen(true)}
                  sx={iconButtonSx}
                  aria-label="Open menu"
                  aria-expanded={menuOpen}
                  aria-controls="nav-mobile-drawer"
                >
                  <MenuIcon />
                </IconButton>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {!isDesktop ? (
        <>
          {/* Phone search: full-width sheet from the top with live results. */}
          <Drawer
            anchor="top"
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
            sx={{ zIndex: (t) => t.zIndex.modal }}
            PaperProps={{
              sx: {
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                maxHeight: "85vh",
                p: 2,
                pt: "max(16px, env(safe-area-inset-top, 0px))",
              },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Search bikes
              </Typography>
              <IconButton onClick={() => setSearchOpen(false)} aria-label="Close search" size="small">
                <CloseIcon />
              </IconButton>
            </Stack>
            {searchOpen ? (
              <NavBarGlobalSearch inline autoFocus onNavigate={() => setSearchOpen(false)} />
            ) : null}
          </Drawer>

          <Drawer
            anchor="right"
            open={menuOpen}
            onClose={closeMenu}
            ModalProps={{ keepMounted: true }}
            sx={{ zIndex: (t) => t.zIndex.modal }}
            PaperProps={{
              id: "nav-mobile-drawer",
              sx: {
                width: "min(100vw - 40px, 320px)",
                maxWidth: "100vw",
                bgcolor: useLightChrome ? NAV_BAR_BG : "#f5f5f5",
                color: drawerTextColor,
                backgroundImage: "none",
                boxShadow: "-8px 0 32px rgba(0,0,0,0.18)",
                borderTopLeftRadius: 16,
                borderBottomLeftRadius: 16,
                pb: "max(16px, env(safe-area-inset-bottom, 0px))",
              },
            }}
          >
            <Box
              component="nav"
              aria-label="Mobile navigation"
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.75,
                  borderBottom: useLightChrome
                    ? "1px solid rgba(255,255,255,0.14)"
                    : "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <Typography
                  variant="overline"
                  sx={{ letterSpacing: "0.2em", fontWeight: 700, fontSize: "0.72rem", color: drawerMutedColor }}
                >
                  Menu
                </Typography>
                <IconButton
                  onClick={closeMenu}
                  aria-label="Close menu"
                  edge="end"
                  sx={{
                    color: useLightChrome ? "#fff" : "rgba(0,0,0,0.7)",
                    "&:hover": {
                      bgcolor: useLightChrome ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box sx={{ flex: 1, py: 1, overflowY: "auto" }}>
                {[
                  { to: "/shop", label: "Shop" },
                  { to: "/service", label: "Service" },
                  { to: "/contact", label: "Contact" },
                  ...(isAuthenticated ? [{ to: "/admin-dashboard", label: "Admin" }] : []),
                ].map(({ to, label }) => {
                  const active = navItemIsActive(to);
                  return (
                    <ListItemButton
                      key={to}
                      component={RouterLink}
                      to={to}
                      onClick={closeMenu}
                      selected={active}
                      sx={drawerItemSx}
                    >
                      <ListItemText
                        primary={label}
                        primaryTypographyProps={{
                          fontWeight: active ? 600 : 500,
                          fontSize: "1.05rem",
                          letterSpacing: "0.02em",
                        }}
                      />
                    </ListItemButton>
                  );
                })}
                {isAuthenticated ? (
                  <ListItemButton
                    onClick={() => {
                      closeMenu();
                      void logout();
                    }}
                    sx={drawerItemSx}
                  >
                    <ListItemText
                      primary="Log out"
                      primaryTypographyProps={{ fontWeight: 500, fontSize: "1.05rem", letterSpacing: "0.02em" }}
                    />
                  </ListItemButton>
                ) : null}
              </Box>
              <Divider
                sx={{ borderColor: useLightChrome ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)", mx: 2 }}
              />
              {/* Quick contact card */}
              <Stack sx={{ px: 2.5, pt: 1.5, pb: 1 }}>
                <Box sx={{ ...contactRowSx, "&:hover": undefined }}>
                  <StatusDot isOpen={shopStatus.isOpen} />
                  <Typography component="span" sx={{ fontSize: "0.95rem", fontWeight: 600 }}>
                    {shopStatus.label}
                  </Typography>
                </Box>
                <Box component="a" href={`tel:${SHOP_PHONE.tel}`} sx={contactRowSx}>
                  <PhoneOutlinedIcon sx={{ fontSize: 20, color: drawerMutedColor }} aria-hidden />
                  {SHOP_PHONE.display}
                </Box>
                <Box
                  component="a"
                  href={SHOP_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={contactRowSx}
                >
                  <DirectionsOutlinedIcon sx={{ fontSize: 20, color: drawerMutedColor }} aria-hidden />
                  Get directions
                </Box>
                <Box
                  component="a"
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={contactRowSx}
                >
                  <InstagramIcon sx={{ fontSize: 20, color: drawerMutedColor }} aria-hidden />
                  Instagram
                </Box>
              </Stack>
            </Box>
          </Drawer>
        </>
      ) : null}
    </Box>
  );
};

export default NavBar;
