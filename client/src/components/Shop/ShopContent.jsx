import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import BikeGrid from "./BikeGrid";
import axios from "axios";
import ShopNote from "./ShopNote";
import FilterMenu from "./FilterMenu";

const ShopContent = () => {
  const [bikes, setBikes] = useState(null);

  useEffect(() => {
    const fetchBikes = async () => {
      await axios
        .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/`, {})
        .then((res) => {
          setBikes(res.data);
        })
        .catch((error) => {});
    };
    fetchBikes();
  }, []);

  return (
    <Box>
      <ShopNote></ShopNote>
      <FilterMenu setBikes={setBikes}></FilterMenu>

      <BikeGrid bikes={bikes}></BikeGrid>
    </Box>
  );
};

export default ShopContent;
