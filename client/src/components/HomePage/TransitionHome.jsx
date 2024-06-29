import { Box } from "@mui/material";

const TransitionHome = () => {
  return (
    <Box sx={{ mb: -0.5 }} textAlign={"center"}>
      <Box
        position={"absolute"}
        sx={{
          width: "30%",
          color: "white",
          ml: "12%",
          mt: "10%",
          fontSize: "1em",
          fontWeight: "300",
          lineHeight: "1.5",
        }}
      >
        <Box
          component="img"
          sx={{
            width: "100%",
            mb: 2,
          }}
          alt="NSBS"
          src={"transitionlogowhite.png"}
        />
        <Box
          sx={{ display: { xs: "none", sm: "none", md: "none", lg: "block" } }}
        >
          We are proud to be one of the largest Transition Bikes dealers in
          Canada! Transition is a local company from Bellingham, WA. We are
          always well stocked in everything Transition offers, from XC to DH.
        </Box>
      </Box>
      <Box
        component="img"
        sx={{
          width: "100%",
          mh: 5,
          //   ml: 30,
          //   mt: 10,
        }}
        alt="NSBS"
        src={"transitionriding copy-min.jpg"}
      />
    </Box>
  );
};

export default TransitionHome;
