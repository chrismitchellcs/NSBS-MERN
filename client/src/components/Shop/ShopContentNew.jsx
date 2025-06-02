import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import NavBarShop from "components/General/NavBarShop";
import BikeGrid from "./BikeGrid";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import FilterList from "./FilterList";
import PriceSlider from "./priceSlider";
import SearchBar from "./SearchBar";
import { AppBar, Button, Stack, styled } from "@mui/material";
import LoadingBikes from "./LoadingBikes";

const drawerWidth = 240;

export default function ShopContentNew(props) {
  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }
  const [bikes, setBikes] = useState(null);
  const [allBikes, setAllBikes] = useState(null);
  const [checkedBrands, setCheckedBrands] = React.useState([]);
  const [checkedTypes, setCheckedTypes] = React.useState([]);
  const [price, setPrice] = React.useState([0, 15000]);

  var { brand } = useParams();

  React.useEffect(() => {
    const fetchBikes = async () => {
      if (brand === undefined) {
        console.log("no brand");
        await axios
          .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/`, {
            withCredentials: true,
          })
          .then((res) => {
            setBikes(res.data);
            setAllBikes(res.data);
          })
          .catch((error) => {});
      } else if (
        brand === "transition" ||
        brand === "norco" ||
        brand === "ibis"
      ) {
        console.log("brand");
        await axios
          .post(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/brand`, {
            brand: capitalizeFirstLetter(brand),
          })
          .then((res) => {
            setBikes(res.data);
          })
          .catch((error) => {});
        await axios
          .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/`, {})
          .then((res) => {
            setAllBikes(res.data);
          })
          .catch((error) => {});
      } else {
        var newBrand = brand.replace(/\+/g, " ");
        newBrand = newBrand.replace(/\=/g, "/");
        newBrand = newBrand
          .split(" ")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" ");
        console.log("new brand: " + newBrand);
        if (newBrand === "E-bike") {
          newBrand = "E-Bike";
        }
        await axios
          .post(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/type`, {
            type: newBrand,
          })
          .then((res) => {
            setBikes(res.data);
          })
          .catch((error) => {});
        await axios
          .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/`, {})
          .then((res) => {
            setAllBikes(res.data);
          })
          .catch((error) => {});
      }
    };

    fetchBikes();
  }, []);

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

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const SeeMoreButton = styled(Button)({
    color: "white",

    maxHeight: "40px",
    fontWeight: "400",
    fontSize: "14px",
    backgroundColor: "#3c5d4e",
    marginTop: "15px",
    paddingLeft: "20px",
    paddingRight: "20px",

    "&:hover": {
      backgroundColor: "#4d5e5f",
      color: "white",
    },
  });

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <NavBarShop></NavBarShop>
      {!open && (
        <Box display={{ xs: "block", sm: "none", md: "none" }}>
          <AppBar
            position="fixed"
            elevation={0}
            sx={{
              mt: "76px",
              bgcolor: "transparent",
            }}
          >
            <Toolbar sx={{ bgcolor: "transparent", justifyContent: "center" }}>
              <SeeMoreButton onClick={toggleDrawer}>
                Filter Results
              </SeeMoreButton>
            </Toolbar>
          </AppBar>
        </Box>
      )}
      <Box display={{ xs: "none", sm: "block", md: "block" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />

          <Box sx={{ overflow: "auto" }}>
            <SearchBar
              allBikes={allBikes}
              setBikes={setBikes}
              setCheckedBrands={setCheckedBrands}
              setCheckedTypes={setCheckedTypes}
              price={price}
              setPrice={setPrice}
            ></SearchBar>

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
            ></FilterList>

            {/* <Box mt={2} ml={2} fontWeight={700}>
              PRICE
            </Box> */}
            {/* <PriceSlider
              allBikes={allBikes}
              setBikes={setBikes}
              bikes={bikes}
              setPrice={setPrice}
              price={price}
            ></PriceSlider> */}
            <Box m={2} fontWeight={400} fontSize={"14px"}>
              We do our best to keep our inventory updated but it isn't always
              correct. Feel free to contact us with any inquiries.
            </Box>
          </Box>
        </Drawer>
      </Box>
      {open && (
        <Box>
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
          >
            <Toolbar />

            <Stack sx={{ overflow: "auto", justifyContent: "center" }}>
              <SearchBar
                allBikes={allBikes}
                setBikes={setBikes}
                setCheckedBrands={setCheckedBrands}
                setCheckedTypes={setCheckedTypes}
                price={price}
                setPrice={setPrice}
              ></SearchBar>

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
              ></FilterList>

              {/* <Box mt={2} ml={2} fontWeight={700}>
                PRICE
              </Box>
              <PriceSlider
                allBikes={allBikes}
                setBikes={setBikes}
                bikes={bikes}
                setPrice={setPrice}
                price={price}
              ></PriceSlider> */}

              <Box
                justifySelf={"center"}
                justifyContent={"center"}
                alignItems={"center"}
                textAlign={"center"}
                mb={5}
              >
                <SeeMoreButton onClick={toggleDrawer}>
                  Show Results
                </SeeMoreButton>
              </Box>
            </Stack>
          </Drawer>
        </Box>
      )}
      <Box
        component="main"
        mt={{ xs: 18, sm: 12 }}
        sx={{ flexGrow: 1 }}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {bikes ? (
          <BikeGrid bikes={bikes}></BikeGrid>
        ) : (
          <Box justifyContent={"center"}>
            <LoadingBikes></LoadingBikes>
          </Box>
        )}
      </Box>
    </Box>
  );
}
