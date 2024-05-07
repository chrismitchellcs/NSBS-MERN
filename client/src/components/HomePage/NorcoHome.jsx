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
          src={"norcologowhite.png"}
        />
        <Box
          sx={{ display: { xs: "none", sm: "none", md: "none", lg: "block" } }}
        >
          Norco is a local brand from Coquitlam, BC that sell bikes for all
          riders. Norco has bikes for beginners looking to do some trails and
          city riding, to experts wanting the fastest and most advanced bike you
          can buy.
        </Box>
      </Box>
      <Box
        component="img"
        sx={{
          width: "100%",
          mh: 5,
          p: 0,
        }}
        alt="NSBS"
        src={"lucas2.png"}
      />
    </Box>
  );
};

export default NorcoHome;
