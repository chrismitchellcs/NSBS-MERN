import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Closer from "components/General/Closer";
import NavBar from "components/General/NavBar";
import BikeGrid from "./BikeGrid";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import FilterList from "./FilterList";
import SearchBar from "./SearchBar";
import {
  AppBar,
  Button,
  styled,
  useTheme,
  useMediaQuery,
  IconButton,
  Typography,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import LoadingBikes from "./LoadingBikes";

const drawerWidth = 260;

export default function ShopContentNew(props) {
  const [bikes, setBikes] = useState(null);
  const [allBikes, setAllBikes] = useState(null);
  const [checkedBrands, setCheckedBrands] = React.useState([]);
  const [checkedTypes, setCheckedTypes] = React.useState([]);
  const [price, setPrice] = React.useState([0, 15000]);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const location = useLocation();
  const state = location.state;

  React.useEffect(() => {
    const fetchBikes = async () => {
      await axios
        .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/`, {
          withCredentials: true,
        })
        .then((res) => {
          if (state && state.brand) {
            setCheckedBrands([state.brand]);
            setBikes(res.data.filter((bike) => bike.brand === state.brand));
          } else {
            setBikes(res.data);
          }
          setAllBikes(res.data);
        })
        .catch((error) => {});
      // if (brand === undefined) {
      //   console.log("no brand");
      //   await axios
      //     .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/`, {
      //       withCredentials: true,
      //     })
      //     .then((res) => {
      //       setBikes(res.data);
      //       setAllBikes(res.data);
      //     })
      //     .catch((error) => {});
      // } else if (
      //   brand === "transition" ||
      //   brand === "norco" ||
      //   brand === "ibis"
      // ) {
      //   console.log("brand");
      //   await axios
      //     .post(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/brand`, {
      //       brand: capitalizeFirstLetter(brand),
      //     })
      //     .then((res) => {
      //       setBikes(res.data);
      //     })
      //     .catch((error) => {});
      //   await axios
      //     .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/`, {})
      //     .then((res) => {
      //       setAllBikes(res.data);
      //     })
      //     .catch((error) => {});
      // } else {
      //   var newBrand = brand.replace(/\+/g, " ");
      //   newBrand = newBrand.replace(/=/g, "/");
      //   newBrand = newBrand
      //     .split(" ")
      //     .map((word) => word[0].toUpperCase() + word.slice(1))
      //     .join(" ");
      //   console.log("new brand: " + newBrand);
      //   if (newBrand === "E-bike") {
      //     newBrand = "E-Bike";
      //   }
      //   await axios
      //     .post(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/type`, {
      //       type: newBrand,
      //     })
      //     .then((res) => {
      //       setBikes(res.data);
      //     })
      //     .catch((error) => {});
      //   await axios
      //     .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/`, {})
      //     .then((res) => {
      //       setAllBikes(res.data);
      //     })
      //     .catch((error) => {});
      // }
    };

    fetchBikes();
  }, [state]);

  const bikeTypes = [
    "DH",
    "Enduro / All Mountain",
    "Trail",
    "XC",
    "Dirt Jumper",
    "Recreational",
    "Kids",
    "E-Bike",
  ];

  const bikeBrands = ["Transition", "Norco", "Ibis"];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /** When nav hides on scroll, relax top offsets so content/filter bar don’t leave a dead strip. */
  const [navHidden, setNavHidden] = useState(false);

  const FilterButton = styled(Button)({
    color: "white",
    maxHeight: "40px",
    fontWeight: "500",
    fontSize: "14px",
    backgroundColor: "#3c5d4e",
    paddingLeft: "20px",
    paddingRight: "20px",
    borderRadius: "8px",
    textTransform: "none",
    boxShadow: "0 2px 8px rgba(60, 93, 78, 0.3)",

    "&:hover": {
      backgroundColor: "#4d6e5f",
      color: "white",
      boxShadow: "0 4px 16px rgba(60, 93, 78, 0.4)",
    },
  });

  /** Fixed offset under fixed nav — must not change when nav animates or scroll feedback loops / flicker. */
  const drawerTopSpacerSx = {
    flexShrink: 0,
    height: { xs: theme.spacing(9), sm: theme.spacing(12) },
    overflow: "hidden",
  };

  const filtersBody = (
    <Box sx={{ px: { xs: 1, sm: 2 }, pt: 1, pb: 2 }}>
      <SearchBar
        allBikes={allBikes}
        setBikes={setBikes}
        setCheckedBrands={setCheckedBrands}
        setCheckedTypes={setCheckedTypes}
        price={price}
        setPrice={setPrice}
      />

      <FilterList
        allBikes={allBikes}
        setBikes={setBikes}
        bikeTypes={bikeTypes}
        bikeBrands={bikeBrands}
        checkedBrands={checkedBrands}
        setCheckedBrands={setCheckedBrands}
        checkedTypes={checkedTypes}
        setCheckedTypes={setCheckedTypes}
        price={price}
        setPrice={setPrice}
      />

      <Box
        m={2}
        fontWeight={500}
        fontSize={"14px"}
        color="#495057"
        lineHeight={1.5}
      >
        We do our best to keep our inventory updated but it isn't always
        correct. Feel free to contact us with any inquiries.
      </Box>
    </Box>
  );

  /** Mobile overlay drawer: spacer still clears the fixed nav inside the sheet. */
  const drawerContentMobile = (
    <>
      <Box sx={drawerTopSpacerSx} aria-hidden />
      <Box sx={{ overflow: "auto", flex: "1 1 auto", minHeight: 0 }}>
        {filtersBody}
      </Box>
    </>
  );

  const desktopStickyTop = navHidden ? theme.spacing(2) : theme.spacing(12);
  const mainTopMargin = navHidden
    ? { xs: isMobile ? 10 : 2, sm: 2 }
    : { xs: isMobile ? 18 : 12, sm: 12 };
  const mobileFiltersAppBarTop = navHidden ? theme.spacing(1) : 76;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* flex 1 1 auto (not flex:1) so this row grows with grid height; footer stays in document flow */}
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          width: "100%",
          minWidth: 0,
        }}
      >
        <CssBaseline />
        <NavBar
          position="fixed"
          displayLogo
          aboveDrawer
          onBarsHiddenChange={setNavHidden}
        />

      {/* Mobile Filter Button */}
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            top: mobileFiltersAppBarTop,
            bgcolor: "transparent",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar
            sx={{ bgcolor: "transparent", justifyContent: "center", mt: 2 }}
          >
            <FilterButton
              onClick={handleDrawerToggle}
              startIcon={<FilterIcon />}
            >
              Filters & Search
            </FilterButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop: outer column stretches to full row height so the divider runs top–bottom */}
      {!isMobile && (
        <Box
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            borderRight: "1px solid #e0e0e0",
            bgcolor: "#fff",
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
            {filtersBody}
          </Box>
        </Box>
      )}

      {/* Mobile Temporary Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid #e0e0e0",
            },
          }}
        >
          {/* Mobile Drawer Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderBottom: "1px solid #e0e0e0",
              bgcolor: "#f8f9fa",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "600", color: "#1a1a1a" }}
            >
              Filters
            </Typography>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          {drawerContentMobile}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: mainTopMargin,
          ml: { xs: 0, sm: 0, lg: 0 },
          px: { xs: 2, sm: 3, lg: 4 },
          maxWidth: "100%",
        }}
      >
        <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
          {bikes ? (
            <BikeGrid bikes={bikes} />
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="400px"
            >
              <LoadingBikes />
            </Box>
          )}
        </Box>
      </Box>
      </Box>
      <Closer />
    </Box>
  );
}
