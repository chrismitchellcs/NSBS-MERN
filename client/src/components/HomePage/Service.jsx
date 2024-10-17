import { Box, Button, styled } from "@mui/material";

const ShopButton = styled(Button)({
  backgroundColor: "#3c5d4e",
  margin: "0%",
  paddingLeft: "1%",
  paddingRight: "1%",
  color: "white",
  maxHeight: "40px",
  fontWeight: "300",
  fontSize: "16px",

  "&:hover": {
    backgroundColor: "#4d5e5f",
    color: "white",
  },
});

const Service = () => {
  return (
    <Box textAlign={"center"} m={0}>
      <Box
        component={"img"}
        width={"100vw"}
        height={"39.3vw"}
        src="service-stretch-min.jpg"
      ></Box>
      <Box
        sx={{
          fontSize: { xs: "26px", sm: "30px" },
          color: "black",
          m: 2,
          fontWeight: "500",
        }}
      >
        SERVICE
      </Box>
      <Box
        sx={{
          fontSize: { xs: "18px", sm: "20px" },
          fontWeight: "400",
          color: "black",
          width: "60%",
          m: 2,
          ml: "20%",
          lineHeight: "1.5",
        }}
        textAlign={"center"}
      >
        Experience our service department, where tidiness, speed, and competent
        mechanics are guaranteed to get you back on your bike quickly. Our
        unmatched turn-around time and expertise ensure that we fix everything
        bicycle-related, making us your go-to shop in town.
      </Box>
      <Box mb={2}>
        <ShopButton href="service">More Info</ShopButton>
      </Box>
    </Box>
  );
};

export default Service;
