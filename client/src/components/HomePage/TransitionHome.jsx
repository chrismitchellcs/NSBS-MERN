import { Box } from "@mui/material";
import FadeInSection from "components/General/FadeInSection";

const TransitionHome = () => {
  return (
    <Box sx={{ mb: -0.5 }} textAlign={"center"}>
      <Box
        position={"absolute"}
        sx={{
          width: "40%",
          color: "white",
          ml: "53%",
          mt: "16%",

          fontWeight: "400",
          lineHeight: "1.5",
        }}
        fontSize={{ xs: "16px", sm: "14px", md: "16px", lg: "18px" }}
      >
        <Box
          component="img"
          sx={{
            width: "80%",
            mb: 2,
          }}
          alt="NSBS"
          src={"transitionlogowhite.png"}
        />
        <Box
          sx={{
            display: { xs: "none", sm: "none", md: "none", lg: "block" },
          }}
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
          height: "45.1vw",
          mh: 5,
          //   ml: 30,
          //   mt: 10,
        }}
        alt="NSBS"
        src={"hannahb.jpg"}
      />
    </Box>
  );
};

export default TransitionHome;
