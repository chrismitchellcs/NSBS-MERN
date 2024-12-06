import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import BikeGrid from "./BikeGrid";
import axios from "axios";
import ShopNote from "./ShopNote";
import FilterMenu from "./FilterMenu";
import { useNavigate, useParams } from "react-router-dom";
import SideFilterMenu from "./SideFilterMenu";

const ShopContent = () => {
  const navigate = useNavigate();
  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }
  const [bikes, setBikes] = useState(null);
  var { brand } = useParams();
  // if (brand) {
  //   brand = brand.toLowerCase();
  //   navigate(brand);
  // }

  useEffect(() => {
    const fetchBikes = async () => {
      if (brand == undefined) {
        console.log("no brand");
        await axios
          .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/`, {})
          .then((res) => {
            setBikes(res.data);
          })
          .catch((error) => {});
      } else if (brand == "transition" || brand == "norco" || brand == "ibis") {
        console.log("brand");
        await axios
          .post(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/brand`, {
            brand: capitalizeFirstLetter(brand),
          })
          .then((res) => {
            setBikes(res.data);
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
        if (newBrand == "E-bike") {
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
      }
    };

    fetchBikes();
  }, []);

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box display={{ xs: "block", sm: "none" }}>
        {/* <ShopNote></ShopNote> */}
        <FilterMenu setBikes={setBikes}></FilterMenu>
      </Box>
      {/* <Box height={"80px"} width={"200px"} borderRight={1}></Box> */}
      <Box display={"flex"}>
        <Box height={"100%"} display={{ xs: "none", sm: "block" }}>
          <SideFilterMenu setBikes={setBikes}></SideFilterMenu>
        </Box>
        <Box>
          <BikeGrid bikes={bikes}></BikeGrid>
        </Box>
      </Box>
    </Box>
  );
};

export default ShopContent;
