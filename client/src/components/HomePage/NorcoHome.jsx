import { Box } from "@mui/material";

const NorcoHome = () => {
  return (
    <Box sx={{ mb: -0.5 }} textAlign={"center"}>
      <Box
        position={"absolute"}
        sx={{
          width: "40%",
          color: "white",
          ml: "9%",
          mt: "15%",

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
          src={"norco.svg"}
        />

        <Box
          sx={{
            display: { xs: "none", sm: "none", md: "block", lg: "block" },
          }}
        >
          Norco is a local brand from Coquitlam, BC, offering bikes for every
          rider. Whether you're a beginner exploring trails and city streets or
          an expert seeking the fastest, most advanced bike available, Norco has
          you covered.
        </Box>
      </Box>
      <Box
        component="img"
        sx={{
          width: "100%",
          height: "45.1vw",
          mh: 5,
          p: 0,
        }}
        alt="NSBS"
        src={"gracey2-min.jpg"}
      />
    </Box>
  );
};

export default NorcoHome;
