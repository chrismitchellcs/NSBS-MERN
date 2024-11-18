import { Box } from "@mui/material";

const Announcement = () => {
  return (
    <Box pb={5} textAlign={"center"}>
      <Box
        position={"absolute"}
        sx={{
          width: "60%",
          ml: "auto",
          mr: "auto",
          mt: { xs: 1, sm: 3, md: 2 },
          left: 0,
          right: 0,
          textAlign: "center",

          color: "white",

          lineHeight: "1.5",
        }}
        fontWeight={{ xs: "500", sm: "400", md: "350" }}
        fontSize={{ xs: "16px", sm: "18px", md: "20px" }}
      >
        <Box
          component="img"
          sx={{
            width: "15vw",
            mb: 0,
          }}
          alt="NSBS"
          src={"logobird.png"}
        />
        <Box>
          North Shore Bike Shop is now carrying Ibis Cycles! Discover their
          unmatched performance, innovation, and trail-ready design today!
        </Box>
      </Box>
      <Box
        component="img"
        sx={{
          borderRadius: "20px",
          width: "90vw",

          mh: 5,
          //   ml: 30,
          //   mt: 10,
        }}
        alt="NSBS"
        src={"hd6.jpg"}
      />
    </Box>
  );
};

export default Announcement;
