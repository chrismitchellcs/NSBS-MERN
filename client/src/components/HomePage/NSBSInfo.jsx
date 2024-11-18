import { Box, Button, Stack, styled } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BuildOutlinedIcon from "@mui/icons-material/Build";
import PedalBikeIcon from "@mui/icons-material/PedalBike";

const InfoButton = styled(Button)({
  backgroundColor: "transparent",
  color: "black",

  fontSize: "20px",
  fontWeight: "normal",
  textTransform: "none",
  border: "2px solid white",
  borderRadius: "20px",

  "&:hover": {
    backgroundColor: "white",
    border: "2px solid",
    color: "black",
  },
});

const NSBSInfo = () => {
  return (
    <Box textAlign={"center"} justifyContent={"center"} m={5}>
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
        direction={"row"}
        justifyContent={"space-evenly"}
        alignItems={"flex-start"}
      >
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
                sx={{ fontSize: { xs: "40px", sm: "50px" } }}
              ></PedalBikeIcon>
            </Box>
            <Box
              sx={{ fontSize: { xs: "14px", sm: "18px" } }}
              fontWeight={"500"}
            >
              SHOP BIKES
            </Box>
            <Box
              sx={{ fontSize: { xs: "15px", sm: "15px" } }}
              fontWeight={"400"}
              display={{ xs: "none", sm: "none", md: "block" }}
            >
              Explore the wide range of bikes available at our shop!
            </Box>
          </Stack>
        </InfoButton>
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
                sx={{ fontSize: { xs: "35px", sm: "35px" } }}
              ></BuildOutlinedIcon>
            </Box>
            <Box
              sx={{ fontSize: { xs: "14px", sm: "18px" } }}
              fontWeight={"500"}
            >
              SERVICE INFO
            </Box>
            <Box
              sx={{ fontSize: { xs: "15px", sm: "15px" } }}
              fontWeight={"400"}
              display={{ xs: "none", sm: "none", md: "block" }}
            >
              Bring your bike in for top-notch service with quick turnaround
              times.
            </Box>
          </Stack>
        </InfoButton>
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
                sx={{ fontSize: { xs: "35px", sm: "35px" } }}
              ></LocationOnOutlinedIcon>
            </Box>
            <Box
              sx={{ fontSize: { xs: "14px", sm: "18px" } }}
              fontWeight={"500"}
            >
              CONTACT US
            </Box>
            <Box
              display={{ xs: "none", sm: "none", md: "block" }}
              sx={{ fontSize: { xs: "15px", sm: "15px" } }}
              fontWeight={"400"}
            >
              Contact us or visit our shop today to explore our products and
              services!
            </Box>
          </Stack>
        </InfoButton>
      </Stack>
    </Box>
  );
};

export default NSBSInfo;
