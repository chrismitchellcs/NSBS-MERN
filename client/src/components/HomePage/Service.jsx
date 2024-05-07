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
      <Box component={"img"} src="service-stretch.jpg" width={"100%"}></Box>
      <Box
        sx={{
          fontSize: { xs: "26px", sm: "30px" },
          color: "black",
          m: 2,
          fontWeight: "400",
        }}
      >
        SERVICE
      </Box>
      <Box
        sx={{
          fontSize: { xs: "18px", sm: "24px" },
          fontWeight: "300",
          color: "black",
          width: "60%",
          m: 2,
          ml: "20%",
        }}
        textAlign={"center"}
      >
        Our service department is tidy, fast, and staffed with competent
        mechanics who are eager to see you back on your bike. Our turn-around
        time is unmatched anywhere else in town. We fix everything bicycle
        related.
      </Box>
      <Box mb={2}>
        <ShopButton href="service">More Info</ShopButton>
      </Box>
    </Box>
  );
};

export default Service;
