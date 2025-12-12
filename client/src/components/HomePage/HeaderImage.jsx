import { Box, Fade, Stack } from "@mui/material";
import { useEffect, useState } from "react";

const HeaderImage = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Box sx={{ mb: -0.5, position: "relative" }}>
      <Stack
        position={"absolute"}
        sx={{
          width: { xs: "90%", sm: "85%", md: "80%" },
          ml: "auto",
          mr: "auto",
          top: { xs: "60%", sm: "60%", md: "60%" },
          transform: "translateY(-50%)",
          left: 0,
          right: 0,
          textAlign: "center",
          color: "white",
          zIndex: 10,
        }}
        spacing={1}
      >
        <Fade in={show} timeout={1500}>
          <Box
            sx={{
              fontSize: { xs: "44px", sm: "36px", md: "4vw", lg: "4.5vw" },
              fontWeight: "bold",
              letterSpacing: { xs: "-1px", sm: "-0.5px", md: "0px" },

              lineHeight: { xs: 1.2, md: 1.3 },
            }}
          >
            NORTH SHORE BIKE SHOP
          </Box>
        </Fade>
        <Fade in={show} timeout={3000}>
          <Box
            sx={{
              fontSize: { xs: "24px", sm: "20px", md: "2vw", lg: "2.2vw" },
              fontWeight: "400",
              letterSpacing: { xs: "-0.5px", sm: "0px", md: "0px" },

              mt: { xs: 0.5, md: 0 },
            }}
          >
            Proudly Serving the North Shore Since 2007
          </Box>
        </Fade>
      </Stack>

      {/* {load ? ( */}

      <Box
        display={{ xs: "none", sm: "none", md: "block" }}
        component="img"
        sx={{
          width: "100%",
          height: "39.55vw",
          m: 0,
          p: 0,
        }}
        alt="NSBS"
        src={"trees-edit-min.png"}
      />

      <Box
        display={{ xs: "block", sm: "block", md: "none" }}
        component="img"
        sx={{
          width: "100%",
          height: { xs: "70vh", sm: "75vh", md: "66.65vw" },
          m: 0,
          p: 0,
          objectFit: "cover",
          objectPosition: "top center",
        }}
        alt="NSBS"
        src={"2-Norco-BC-min.png"}
      />
    </Box>
  );
};

export default HeaderImage;
