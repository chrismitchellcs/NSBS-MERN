import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import CssBaseline from "@mui/material/CssBaseline";
import Closer from "components/General/Closer";
import NavBar, { NAV_BAR_BG } from "components/General/NavBar";
import BikeGrid from "./BikeGrid";
import axios from "axios";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import FilterList, { filterSectionTitleSx, idleChipSx, selectedChipSx } from "./FilterList";
import SearchBar from "./SearchBar";
import {
  Badge,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon, FilterList as FilterIcon } from "@mui/icons-material";
import LoadingBikes from "./LoadingBikes";
import {
  SHOP_BRANDS,
  SHOP_TYPES,
  filterShopBikes,
  hasActiveShopFilters,
  normalizeShopBrand,
  readShopFilters,
  shopFilterCounts,
  sortShopBikes,
  writeShopFilters,
} from "utils/shopFilters";

const drawerWidth = 260;
const SEARCH_DEBOUNCE_MS = 250;

export default function ShopContentNew() {
  const [allBikes, setAllBikes] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { brand: pathBrand } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = React.useMemo(
    () => readShopFilters(searchParams, pathBrand),
    [searchParams, pathBrand]
  );
  const filtersRef = React.useRef(filters);
  filtersRef.current = filters;

  /** Every change replaces the query string, so Back leaves the shop instead of undoing filters. */
  const updateFilters = React.useCallback(
    (patch) => {
      const next = { ...filtersRef.current, ...patch };
      setSearchParams(writeShopFilters(next, pathBrand), { replace: true });
    },
    [setSearchParams, pathBrand]
  );

  // "Shop Transition" buttons pass the brand as navigation state; move it into the URL once.
  const stateBrand = normalizeShopBrand(location.state?.brand);
  React.useEffect(() => {
    if (stateBrand && !searchParams.has("brand") && !pathBrand) {
      updateFilters({ brands: [stateBrand] });
    }
    // Only on arrival with a state brand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateBrand]);

  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/`, { withCredentials: true })
      .then((res) => setAllBikes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setAllBikes([]));
  }, []);

  // Search box updates instantly; the URL (and results) follow after a short pause in typing.
  const [searchInput, setSearchInput] = React.useState(filters.query);
  React.useEffect(() => {
    setSearchInput((prev) => (prev.trim() === filters.query ? prev : filters.query));
  }, [filters.query]);
  React.useEffect(() => {
    if (searchInput.trim() === filtersRef.current.query) return undefined;
    const t = setTimeout(() => updateFilters({ query: searchInput.trim() }), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput, updateFilters]);

  const displayBikes = React.useMemo(
    () => (allBikes ? sortShopBikes(filterShopBikes(allBikes, filters), filters.sort) : null),
    [allBikes, filters]
  );
  const counts = React.useMemo(
    () => (allBikes ? shopFilterCounts(allBikes, filters) : null),
    [allBikes, filters]
  );
  const toggleIn = (list, value) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const clearAllFilters = () => {
    setSearchInput("");
    updateFilters({ query: "", brands: [], types: [], saleOnly: false, sort: "default" });
  };

  /** Brand / type / deals / sort (search sits outside the sheet on phones). */
  const sheetFilterCount =
    filters.brands.length +
    filters.types.length +
    (filters.saleOnly ? 1 : 0) +
    (filters.sort !== "default" ? 1 : 0);

  /** When nav hides on scroll, relax top offsets so content/filter bar don’t leave a dead strip. */
  const [navHidden, setNavHidden] = React.useState(false);

  const gridRef = React.useRef(null);
  const mobileBarRef = React.useRef(null);
  const filtersKey = JSON.stringify([
    filters.query,
    filters.brands,
    filters.types,
    filters.saleOnly,
    filters.sort,
  ]);
  const lastFiltersKey = React.useRef(filtersKey);
  /** New results start at the first row; only scrolls up, and only once you're past the top of the grid. */
  React.useEffect(() => {
    if (lastFiltersKey.current === filtersKey) return;
    lastFiltersKey.current = filtersKey;
    const grid = gridRef.current;
    if (!grid) return;
    const navOffset = isMobile
      ? parseFloat(theme.spacing(9)) + (mobileBarRef.current?.offsetHeight ?? 0)
      : parseFloat(theme.spacing(12));
    const target = grid.getBoundingClientRect().top + window.scrollY - navOffset - 8;
    if (window.scrollY > target + 1) {
      window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
    }
  }, [filtersKey, isMobile, theme]);

  const filterControls = (
    <>
      <Box>
        <FilterList
          bikeBrands={SHOP_BRANDS}
          bikeTypes={SHOP_TYPES}
          checkedBrands={filters.brands}
          checkedTypes={filters.types}
          brandCounts={counts?.brands}
          typeCounts={counts?.types}
          onToggleBrand={(b) => updateFilters({ brands: toggleIn(filters.brands, b) })}
          onToggleType={(t) => updateFilters({ types: toggleIn(filters.types, t) })}
        />
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <Typography variant="overline" sx={filterSectionTitleSx}>
          Deals
        </Typography>
        <Chip
          label={`On Sale (${counts?.sale ?? 0})`}
          onClick={() => updateFilters({ saleOnly: !filters.saleOnly })}
          disabled={!filters.saleOnly && (counts?.sale ?? 0) === 0}
          variant={filters.saleOnly ? "filled" : "outlined"}
          aria-pressed={filters.saleOnly}
          sx={filters.saleOnly ? selectedChipSx : idleChipSx}
        />
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <Typography variant="overline" sx={filterSectionTitleSx}>
          Sort by price
        </Typography>
        <Stack spacing={1} alignItems="flex-start">
          {[
            { value: "asc", label: "Low to High" },
            { value: "desc", label: "High to Low" },
          ].map(({ value, label }) => {
            const selected = filters.sort === value;
            return (
              <Chip
                key={value}
                label={label}
                onClick={() => updateFilters({ sort: selected ? "default" : value })}
                variant={selected ? "filled" : "outlined"}
                aria-pressed={selected}
                sx={selected ? selectedChipSx : idleChipSx}
              />
            );
          })}
        </Stack>
      </Box>
    </>
  );

  const nothingToClear = !hasActiveShopFilters(filters) && filters.sort === "default";

  const inventoryNote = (
    <Typography
      sx={{ mt: 2, fontWeight: 500, fontSize: "14px", color: "#495057", lineHeight: 1.5 }}
    >
      We do our best to keep our inventory updated but it isn&apos;t always correct. Feel free to
      contact us with any inquiries.
    </Typography>
  );

  const desktopFiltersBody = (
    <Box sx={{ px: 2, pt: 2, pb: 2.5 }}>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 700, color: "text.primary", letterSpacing: "-0.01em", mb: 1.5 }}
      >
        Find a bike
      </Typography>

      <SearchBar value={searchInput} onChange={setSearchInput} />

      <Box sx={{ mt: 2.5 }}>{filterControls}</Box>

      <Button
        type="button"
        size="small"
        onClick={clearAllFilters}
        disabled={nothingToClear}
        sx={{
          mt: 2,
          textTransform: "none",
          fontWeight: 600,
          color: "text.secondary",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        Clear all filters
      </Button>

      {inventoryNote}
    </Box>
  );

  const desktopStickyTop = navHidden ? theme.spacing(2) : theme.spacing(12);
  const mainTopMargin = navHidden ? { xs: 1, sm: 2 } : { xs: 10, sm: 12 };
  /** Phones: the Filters button sticks just under the nav. */
  const mobileBarTop = navHidden ? 0 : theme.spacing(9);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* flex 1 1 auto (not flex:1) so this row grows with grid height; footer stays in document flow */}
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          width: "100%",
          minWidth: 0,
          alignItems: "flex-start",
        }}
      >
        <CssBaseline />
        <NavBar position="fixed" displayLogo aboveDrawer onBarsHiddenChange={setNavHidden} />

        {/* Desktop: pt (not mt) so grey.50 fills under the fixed nav; margin would show as a white gap */}
        {!isMobile && (
          <Box
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              /* Stretch to full row height so sticky aside isn’t clipped to filter-only height */
              alignSelf: "stretch",
              pt: mainTopMargin,
              mt: 0,
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "divider",
              bgcolor: "grey.50",
            }}
          >
            <Box
              component="aside"
              aria-label="Filters and search"
              sx={{
                position: "sticky",
                alignSelf: "flex-start",
                width: "100%",
                top: desktopStickyTop,
                maxHeight: `calc(100vh - ${desktopStickyTop} - ${theme.spacing(2)})`,
                overflowY: "auto",
                zIndex: 0,
              }}
            >
              {desktopFiltersBody}
            </Box>
          </Box>
        )}

        {isMobile && (
          // Bottom sheet above the nav: full width, swipe down or tap outside to close.
          <SwipeableDrawer
            anchor="bottom"
            open={mobileOpen}
            onOpen={() => setMobileOpen(true)}
            onClose={() => setMobileOpen(false)}
            disableSwipeToOpen
            ModalProps={{ keepMounted: true }}
            sx={{
              zIndex: (t) => t.zIndex.modal,
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: "100%",
                maxHeight: "85vh",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                bgcolor: "grey.50",
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                bgcolor: "background.paper",
                borderBottom: "1px solid",
                borderColor: "divider",
                px: 2,
                pt: 1,
                pb: 1,
              }}
            >
              <Box
                aria-hidden
                sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: "grey.300", mx: "auto", mb: 1 }}
              />
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Filters
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Button
                    size="small"
                    onClick={clearAllFilters}
                    disabled={nothingToClear}
                    sx={{ textTransform: "none", fontWeight: 600, color: "text.secondary" }}
                  >
                    Clear all
                  </Button>
                  <IconButton
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close filters"
                    size="small"
                    sx={{ color: "text.secondary" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
            <Box sx={{ overflow: "auto", flex: "1 1 auto", minHeight: 0, px: 2, pt: 2, pb: 1 }}>
              {filterControls}
              {inventoryNote}
            </Box>
            <Stack
              sx={{
                flexShrink: 0,
                p: 2,
                pb: "calc(16px + env(safe-area-inset-bottom))",
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Button
                variant="contained"
                disableElevation
                onClick={() => setMobileOpen(false)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  bgcolor: NAV_BAR_BG,
                  "&:hover": { bgcolor: "#1e332b" },
                }}
              >
                Show {displayBikes?.length ?? 0} bikes
              </Button>
            </Stack>
          </SwipeableDrawer>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            mt: mainTopMargin,
            px: { xs: 2, sm: 3, lg: 4 },
            pb: 4,
          }}
        >
          {isMobile ? (
            <Stack
              ref={mobileBarRef}
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                position: "sticky",
                top: mobileBarTop,
                zIndex: 2,
                mx: -2,
                px: 2,
                py: 1,
                bgcolor: "background.default",
                borderBottom: "1px solid",
                borderColor: "divider",
                transition: "top 0.2s ease",
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <SearchBar value={searchInput} onChange={setSearchInput} />
              </Box>
              <Badge badgeContent={sheetFilterCount} color="error" overlap="rectangular">
                <Button
                  onClick={() => setMobileOpen(true)}
                  startIcon={<FilterIcon />}
                  variant="contained"
                  disableElevation
                  sx={{
                    flexShrink: 0,
                    height: 40,
                    bgcolor: NAV_BAR_BG,
                    color: "#fff",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#1e332b" },
                  }}
                >
                  Filters
                </Button>
              </Badge>
            </Stack>
          ) : null}
          <Box ref={gridRef} sx={{ mt: 2 }}>
            {displayBikes ? <BikeGrid bikes={displayBikes} /> : <LoadingBikes />}
          </Box>
        </Box>
      </Box>
      <Closer />
    </Box>
  );
}
