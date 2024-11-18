import { Box, Skeleton, Stack } from "@mui/material";
import { useState } from "react";

const HeaderImage = () => {
  const [load, setLoad] = useState(true);
  const handleLoad = () => {
    setLoad(true);
  };

  return (
    <Box sx={{ mb: -0.5 }}>
      {/* <Box
        component="img"
        position={"absolute"}
        display={{ xs: "none", sm: "none" }}
        sx={{
          width: "20%",
          ml: "auto",
          mr: "auto",
          mt: "20%",
          left: 0,
          right: 0,
          textAlign: "center",
        }}
        alt="NSBS"
        src={"logowhitehq.png"}
      /> */}
      <Stack
        position={"absolute"}
        sx={{
          width: "80%",
          ml: "auto",
          mr: "auto",
          mt: "22%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "4vw",
          color: "white",
        }}
        spacing={1}
      >
        <Box>
          <b>NORTH SHORE</b> BIKE SHOP
        </Box>
        <Box sx={{ fontSize: "2.5vw", fontWeight: "350" }}>
          Proudly Serving the North Shore Since 2007
        </Box>
      </Stack>

      {/* {load ? ( */}
      <Box
        display={{ xs: "none", sm: "none", md: "block" }}
        component="img"
        sx={{
          width: "100vw",
          // height: "34.1vw",
          m: 0,
          p: 0,
        }}
        alt="NSBS"
        src={"trees-edit-min.png"}
        onLoad={handleLoad}
      />
      {/* ) : (
        <Skeleton variant="rectangular" width={210} height={118} />
      )} */}

      <Box
        display={{ xs: "block", sm: "block", md: "none" }}
        component="img"
        sx={{
          width: "100vw",
          // height: "42.7vw",
          m: 0,
          p: 0,
        }}
        alt="NSBS"
        src={"trees-edit-min.png"}
      />
    </Box>
  );
};

export default HeaderImage;
