import { Box, Button, Fade, Stack, styled } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BuildOutlinedIcon from "@mui/icons-material/Build";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import { useEffect, useState } from "react";

const InfoButton = styled(Button)({
  backgroundColor: "transparent",
  color: "black",
  marginTop: "5px",

  marginBottom: "5px",
  fontSize: "22px",

  textTransform: "none",
  border: "2px solid white",
  borderRadius: "20px",

  fontFamily: "Open Sans, sans-serif",
  letterSpacing: 0,
  fontWeight: "600",

  "&:hover": {
    backgroundColor: "white",
    border: "2px solid",
    color: "black",
  },
});

const NSBSInfo = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Box
      textAlign={"center"}
      justifyContent={"center"}
      m={{ xs: 2, sm: 3, md: 5 }}
    >
      {/* <Box
        sx={{ fontSize: { xs: "36px", sm: "36px" } }}
        fontWeight={"600"}
        m={2}
      >
        YOUR LOCAL MTB EXPERTS
      </Box>
      <Box
        sx={{ fontSize: { xs: "18px", sm: "24px" }, fontWeight: "400" }}
        mb={4}
      >
        Since 2007, North Shore Bike Shop has been proudly serving the North
        Shore community.
      </Box> */}
      <Stack
        direction={{ xs: "column", sm: "column", md: "row" }}
        justifyContent={"space-evenly"}
        alignItems={"center"}
      >
        <Fade in={show} timeout={1000}>
          <InfoButton href="shop">
            <Stack
              width={"200px"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                width={"50px"}
                height={"50px"}
              >
                <PedalBikeIcon
                  sx={{ fontSize: { xs: "30px", sm: "50px" } }}
                ></PedalBikeIcon>
              </Box>
              <Box
                sx={{ fontSize: { xs: "18px", sm: "18px" } }}
                fontWeight={"600"}
              >
                SHOP BIKES
              </Box>
              <Box
                sx={{ fontSize: { xs: "15px", sm: "15px" } }}
                fontWeight={"400"}
                // display={{ xs: "none", sm: "none", md: "block" }}
              >
                Explore the wide range of bikes available at our shop!
              </Box>
            </Stack>
          </InfoButton>
        </Fade>
        <Fade in={show} timeout={2000}>
          <InfoButton href={"service"}>
            <Stack
              width={"200px"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                width={"50px"}
                height={"50px"}
              >
                <BuildOutlinedIcon
                  sx={{ fontSize: { xs: "25px", sm: "35px" } }}
                ></BuildOutlinedIcon>
              </Box>
              <Box
                sx={{ fontSize: { xs: "18px", sm: "18px" } }}
                fontWeight={"600"}
              >
                SERVICE INFO
              </Box>
              <Box
                sx={{ fontSize: { xs: "15px", sm: "15px" } }}
                fontWeight={"400"}
                // display={{ xs: "none", sm: "none", md: "block" }}
              >
                Bring your bike in for top-notch service with quick turnaround
                times.
              </Box>
            </Stack>
          </InfoButton>
        </Fade>
        <Fade in={show} timeout={3000}>
          <InfoButton href={"contact"}>
            <Stack
              width={"200px"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                width={"50px"}
                height={"50px"}
              >
                <LocationOnOutlinedIcon
                  sx={{ fontSize: { xs: "25px", sm: "35px" } }}
                ></LocationOnOutlinedIcon>
              </Box>
              <Box
                sx={{ fontSize: { xs: "18px", sm: "18px" } }}
                fontWeight={"600"}
              >
                CONTACT US
              </Box>
              <Box
                // display={{ xs: "none", sm: "none", md: "block" }}
                sx={{ fontSize: { xs: "15px", sm: "15px" } }}
                fontWeight={"400"}
              >
                Contact us or visit our shop today to explore our products and
                services!
              </Box>
            </Stack>
          </InfoButton>
        </Fade>
      </Stack>
    </Box>
  );
};

export default NSBSInfo;
