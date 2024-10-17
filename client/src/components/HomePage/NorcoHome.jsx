import { Box } from "@mui/material";

const NorcoHome = () => {
  return (
    <Box sx={{ mb: -0.5 }} textAlign={"center"}>
      <Box
        position={"absolute"}
        sx={{
          width: "30%",
          color: "white",
          ml: "52%",
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
          src={"norcologowhite-min.png"}
        />
        <Box
          sx={{ display: { xs: "none", sm: "none", md: "none", lg: "block" } }}
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
          width: "100vw",
          height: "30vw",
          mh: 5,
          p: 0,
        }}
        alt="NSBS"
        src={"lucas2-min.png"}
      />
    </Box>
  );
};

export default NorcoHome;
