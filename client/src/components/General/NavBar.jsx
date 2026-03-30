import CloseIcon from "@mui/icons-material/Close";
import { LocationOn } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
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
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "components/AuthProvider";
import NavBarGlobalSearch from "components/General/NavBarGlobalSearch";

/** Matches hero headline / HeaderImage.jsx */
export const NAV_BAR_BG = "#243d33";

/** Only force bar visible when essentially at document top (avoids layout-shift loops with hide/show). */
const SCROLL_PIN_OPEN_PX = 20;
/** Min scroll delta to change hide state — higher = less jitter when scrolling slowly. */
const SCROLL_DELTA_HIDE = 14;
const SCROLL_DELTA_SHOW = 12;
/** Home `background="transparent"`: glass bar only while scroll is within this many px of top */
const TRANSPARENT_NAV_UNTIL = 24;

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollHidden, setScrollHidden] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const lastScrollY = useRef(0);
  /** After a hide/show transition, ignore scroll-driven toggles briefly (layout / subpixel jitter). */
  const scrollHideCooldownUntil = useRef(0);
  const { isAuthenticated } = useAuth();

  const isAdminGray = background === "#F5F5F5";

  /** Glass over hero at top only; scrolled home uses solid green like other pages */
  const barIsGlass =
    variant !== "solid" &&
    ((background === "transparent" && scrollTop < TRANSPARENT_NAV_UNTIL) ||
      (variant === "overlay" && background !== "transparent"));

  /** Solid green strip (customer pages); not glass, not admin gray */
  const isDarkGreenBar =
    !barIsGlass &&
    !isAdminGray &&
    (background === NAV_BAR_BG || background === "transparent");

  /** White logo + light search pill everywhere except admin toolbar */
  const useLightChrome = !isAdminGray;

  const visuallyHidden =
    hideOnScroll && scrollHidden && !menuOpen && position !== "static";

  useEffect(() => {
    onBarsHiddenChange?.(visuallyHidden);
  }, [visuallyHidden, onBarsHiddenChange]);

  useEffect(() => {
    setScrollHidden(false);
    scrollHideCooldownUntil.current = 0;
    const y = typeof window !== "undefined" ? window.scrollY : 0;
    lastScrollY.current = y;
    setScrollTop(y);
  }, [pathname]);

  useEffect(() => {
    if (position === "static") return undefined;

    const onScroll = () => {
      const y = window.scrollY;
      if (background === "transparent") setScrollTop(y);

      if (!hideOnScroll) return;

      if (menuOpen) {
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
  }, [background, hideOnScroll, menuOpen, position]);

  const closeMenu = () => setMenuOpen(false);

  const navItemIsActive = (to) => {
    if (to === "/shop") return pathname.startsWith("/shop");
    if (to === "/service") return pathname.startsWith("/service");
    if (to === "/contact") return pathname.startsWith("/contact");
    if (to === "/admin-dashboard")
      return pathname.startsWith("/admin-dashboard");
    return false;
  };

  /** Pill hover + optional active fill (matches global search treatment) */
  const linkButtonSx = (to) => {
    const active = navItemIsActive(to);
    return {
      textTransform: "none",
      fontFamily: "Inter, sans-serif",
      fontWeight: 400,
      fontSize: "0.9375rem",
      letterSpacing: "0.04em",
      minWidth: 0,
      px: 1.75,
      py: 0.65,
      borderRadius: "999px",
      maxHeight: 40,
      mx: 0,
      transition: (theme) =>
        theme.transitions.create(["background-color", "color"], {
          duration: 180,
        }),
      color: useLightChrome ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.85)",
      textDecoration: "none",
      ...(useLightChrome
        ? {
            ...(active && {
              bgcolor: "rgba(255,255,255,0.18)",
              color: "#fff",
            }),
            "&:hover": {
              textDecoration: "none",
              bgcolor: active
                ? "rgba(255,255,255,0.24)"
                : "rgba(255,255,255,0.12)",
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

  const menuIconButtonSx = {
    color: useLightChrome ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.87)",
    minWidth: 0,
    "&:hover": {
      backgroundColor: useLightChrome
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.04)",
    },
  };

  const logoWidths =
    logoSize === "compact"
      ? { xs: 60, sm: 80, md: 100 }
      : { xs: 100, sm: 80, md: 110 };

  const zBar = (theme) =>
    aboveDrawer ? theme.zIndex.drawer + 1 : theme.zIndex.appBar;

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
          transition: (theme) =>
            theme.transitions.create(["max-height", "opacity"], {
              duration: 240,
            }),
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
          transition: (theme) =>
            theme.transitions.create("transform", { duration: 220 }),
          pointerEvents: visuallyHidden ? "none" : "auto",
        };

  return (
    <Box sx={wrapperSx}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          width: "100%",
          boxShadow: "none",
          transition: (theme) =>
            theme.transitions.create(["background-color", "border-color"], {
              duration: 200,
            }),
          ...(barIsGlass
            ? {
                backgroundColor: "transparent",
                backgroundImage: "none",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
              }
            : {
                backgroundColor:
                  background === "transparent" ? NAV_BAR_BG : background,
                borderBottom: isDarkGreenBar
                  ? "1px solid rgba(255,255,255,0.12)"
                  : isAdminGray
                    ? "1px solid #e0e0e0"
                    : "none",
              }),
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
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 2, sm: 4 }}
            sx={{ flexShrink: 0 }}
          >
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
                  }}
                />
              </Button>
            ) : null}

            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={1}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <Button
                component={RouterLink}
                to="/shop"
                sx={linkButtonSx("/shop")}
              >
                SHOP
              </Button>
              <Button
                component={RouterLink}
                to="/service"
                sx={linkButtonSx("/service")}
              >
                SERVICE
              </Button>
              <Button
                component={RouterLink}
                to="/contact"
                sx={linkButtonSx("/contact")}
              >
                CONTACT
              </Button>
              {isAuthenticated && (
                <Button
                  component={RouterLink}
                  to="/admin-dashboard"
                  sx={linkButtonSx("/admin-dashboard")}
                >
                  Admin
                </Button>
              )}
            </Stack>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ flexShrink: 0, ml: "auto" }}
          >
            <Box
              sx={{
                display: { xs: "none", sm: "block" },
                width: { sm: 200, md: 240 },
                minWidth: 0,
              }}
            >
              <NavBarGlobalSearch isOverlay={useLightChrome} />
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Button
                component={RouterLink}
                to="/contact"
                sx={linkButtonSx("/contact")}
                aria-label="Contact and location"
              >
                <LocationOn />
              </Button>
            </Box>

            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <Button
                onClick={() => setMenuOpen(true)}
                sx={{ ...menuIconButtonSx, minWidth: 48 }}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="nav-mobile-drawer"
              >
                <MenuIcon />
              </Button>
              <Drawer
                anchor="right"
                open={menuOpen}
                onClose={closeMenu}
                ModalProps={{ keepMounted: true }}
                PaperProps={{
                  id: "nav-mobile-drawer",
                  sx: {
                    width: "min(100vw - 40px, 300px)",
                    maxWidth: "100vw",
                    bgcolor: useLightChrome ? NAV_BAR_BG : "#f5f5f5",
                    color: useLightChrome ? "#fff" : "rgba(0,0,0,0.87)",
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
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
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
                      sx={{
                        letterSpacing: "0.2em",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        color: useLightChrome
                          ? "rgba(255,255,255,0.85)"
                          : "rgba(0,0,0,0.55)",
                      }}
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
                          bgcolor: useLightChrome
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.06)",
                        },
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ flex: 1, py: 1 }}>
                    {[
                      { to: "/shop", label: "Shop" },
                      { to: "/service", label: "Service" },
                      { to: "/contact", label: "Contact" },
                      ...(isAuthenticated
                        ? [{ to: "/admin-dashboard", label: "Admin" }]
                        : []),
                    ].map(({ to, label }) => {
                      const active = navItemIsActive(to);
                      return (
                        <ListItemButton
                          key={to}
                          component={RouterLink}
                          to={to}
                          onClick={closeMenu}
                          selected={active}
                          sx={{
                            py: 1.75,
                            px: 2.5,
                            mx: 1,
                            mb: 0.5,
                            borderRadius: 2,
                            color: useLightChrome
                              ? "rgba(255,255,255,0.95)"
                              : "rgba(0,0,0,0.87)",
                            "&.Mui-selected": {
                              bgcolor: useLightChrome
                                ? "rgba(255,255,255,0.14)"
                                : "rgba(0,0,0,0.06)",
                            },
                            "&.Mui-selected:hover": {
                              bgcolor: useLightChrome
                                ? "rgba(255,255,255,0.18)"
                                : "rgba(0,0,0,0.08)",
                            },
                            "&:hover": {
                              bgcolor: useLightChrome
                                ? "rgba(255,255,255,0.08)"
                                : "rgba(0,0,0,0.04)",
                            },
                          }}
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
                  </Box>
                  <Divider
                    sx={{
                      borderColor: useLightChrome
                        ? "rgba(255,255,255,0.12)"
                        : "rgba(0,0,0,0.08)",
                      mx: 2,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      px: 2.5,
                      py: 2,
                      color: useLightChrome
                        ? "rgba(255,255,255,0.45)"
                        : "rgba(0,0,0,0.45)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    North Shore Bike Shop
                  </Typography>
                </Box>
              </Drawer>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
