import { Box, Button, Stack, capitalize, styled } from "@mui/material";
import BikeButton from "../Shop/BikeButton";
import { useEffect, useState } from "react";
import axios from "axios";

const ShopButton = styled(Button)({
  backgroundColor: "#3c5d4e",
  margin: "1%",
  paddingLeft: "1%",
  paddingRight: "1%",
  color: "white",
  maxHeight: "40px",
  fontWeight: "400",
  fontSize: "16px",

  "&:hover": {
    backgroundColor: "#4d5e5f",
    color: "white",
  },
});

const Bikes = ({ brand }) => {
  const [bikes, setBikes] = useState(null);

  const uppercase = brand.toUpperCase();

  useEffect(() => {
    const fetchBikes = async () => {
      await axios
        .post(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/brand`, {
          brand,
        })
        .then((res) => {
          setBikes(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchBikes();
  }, []);

  return (
    <Box textAlign={"center"} mb={2}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        mt={2}
        spacing={3}
      >
        <Box sx={{ fontSize: { xs: "18px", sm: "28px" }, fontWeight: "500" }}>
          SHOP {uppercase} BIKES
        </Box>
        <ShopButton href="shop">See All</ShopButton>
      </Stack>
      <Box
        display="flex"
        sx={{
          backgroundColor: "white",
          width: "100%",
          height: "320px",
          p: 0,

          display: "-ms-flexbox",
          WebkitBoxPack: "center",
          MsFlexPack: "center",

          padding: "0px",
          margin: "0px",
        }}
      >
        <Stack>
          <Stack
            direction="row"
            display={"-ms-flexbox"}
            sx={{
              overflowX: "scroll",
              width: "100%",
              MsFlexPack: "center",
              pt: 1,
              pb: 1,
            }}
          >
            {bikes &&
              bikes.map((bike) => {
                return <BikeButton bike={bike}></BikeButton>;
              })}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Bikes;
