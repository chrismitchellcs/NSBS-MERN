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

  "&:hover": {
    backgroundColor: "#ABC9BC",
    color: "black",
  },
});

const NSBSInfo = () => {
  return (
    <Box textAlign={"center"} justifyContent={"center"} m={5}>
      <Box
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
      </Box>
      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        alignItems={"flex-start"}
      >
        <InfoButton href="shop">
          <Box width={"200px"}>
            <PedalBikeIcon
              sx={{ fontSize: { xs: "40px", sm: "50px" } }}
            ></PedalBikeIcon>
            <Box
              sx={{ fontSize: { xs: "16px", sm: "20px" } }}
              fontWeight={"600"}
            >
              SHOP BIKES
            </Box>
            <Box
              sx={{ fontSize: { xs: "14px", sm: "16px" } }}
              fontWeight={"400"}
              display={{ xs: "none", sm: "none", md: "block" }}
            >
              Explore the wide range of bikes available at our shop!
            </Box>
          </Box>
        </InfoButton>
        <InfoButton href={"service"}>
          <Box width={"200px"}>
            <BuildOutlinedIcon
              sx={{ fontSize: { xs: "40px", sm: "50px" } }}
            ></BuildOutlinedIcon>
            <Box
              sx={{ fontSize: { xs: "16px", sm: "20px" } }}
              fontWeight={"600"}
            >
              SERVICE INFO
            </Box>
            <Box
              sx={{ fontSize: { xs: "14px", sm: "16px" } }}
              fontWeight={"400"}
              display={{ xs: "none", sm: "none", md: "block" }}
            >
              Bring your bike in for top-notch service with quick turnaround
              times.
            </Box>
          </Box>
        </InfoButton>
        <InfoButton href={"contact"}>
          <Box width={"200px"}>
            <LocationOnOutlinedIcon
              sx={{ fontSize: { xs: "40px", sm: "50px" } }}
            ></LocationOnOutlinedIcon>
            <Box
              sx={{ fontSize: { xs: "16px", sm: "20px" } }}
              fontWeight={"600"}
            >
              CONTACT US
            </Box>
            <Box
              display={{ xs: "none", sm: "none", md: "block" }}
              sx={{ fontSize: { xs: "14px", sm: "16px" } }}
              fontWeight={"400"}
            >
              Contact us or visit our shop today to explore our products and
              services!
            </Box>
          </Box>
        </InfoButton>
      </Stack>
    </Box>
  );
};

export default NSBSInfo;
