import { Box, Button, styled } from "@mui/material";

const ShopButton = styled(Button)({
  backgroundColor: "#3c5d4e",
  margin: "1%",
  paddingLeft: "3%",
  paddingRight: "3%",
  color: "white",
  maxHeight: "40px",
  fontWeight: "400",
  fontSize: "14px",

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
        width={"100%"}
        height={"56.45vw"}
        src="IMG_1090.jpg"
      ></Box>
      <Box
        pt={1}
        sx={{
          fontSize: "26px",
          fontWeight: "600",
          color: "black",
          m: 2,
        }}
      >
        Service
      </Box>
      <Box
        sx={{
          fontSize: { xs: "16px", sm: "18px" },
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
