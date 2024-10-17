import { Box, Skeleton } from "@mui/material";
import { useState } from "react";

const HeaderImage = () => {
  const [load, setLoad] = useState(true);
  const handleLoad = () => {
    setLoad(true);
  };

  return (
    <Box sx={{ mb: -0.5 }}>
      <Box
        component="img"
        position={"absolute"}
        sx={{
          width: { xs: "20%", sm: "10%", md: "10%" },
          ml: "auto",
          mr: "auto",
          mt: { xs: 1, sm: 3, md: 2 },
          left: 0,
          right: 0,
          textAlign: "center",
        }}
        alt="NSBS"
        src={"logo.png"}
      />
      {/* {load ? ( */}
      <Box
        display={{ xs: "none", sm: "none", md: "block" }}
        component="img"
        sx={{
          width: "100vw",
          height: "34.1vw",
          m: 0,
          p: 0,
        }}
        alt="NSBS"
        src={"trees-short-min.png"}
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
          height: "42.7vw",
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
