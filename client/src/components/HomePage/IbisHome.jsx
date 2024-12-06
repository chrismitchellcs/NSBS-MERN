import { Box } from "@mui/material";

const IbisHome = () => {
  return (
    <Box sx={{ mb: -0.5 }} textAlign={"center"}>
      <Box
        position={"absolute"}
        sx={{
          width: "40%",
          color: "white",
          ml: "2%",
          mt: "15%",

          fontWeight: "400",
          lineHeight: "1.5",
        }}
        fontSize={{ xs: "16px", sm: "14px", md: "16px", lg: "18px" }}
      >
        <Box
          component="img"
          sx={{
            width: "25%",
            mb: 2,
          }}
          alt="NSBS"
          src={"ibislogo.png"}
        />
        <Box
          sx={{ display: { xs: "none", sm: "none", md: "none", lg: "block" } }}
        >
          Ibis Cycles is known for their high-performance bikes, combining
          innovative technology, lightweight durability, and exceptional design
          to deliver an unparalleled riding experience.
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
        src={"ibisriding.jpeg"}
      />
    </Box>
  );
};

export default IbisHome;
