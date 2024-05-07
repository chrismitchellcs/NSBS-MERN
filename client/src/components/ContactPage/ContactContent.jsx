import { Box, Stack } from "@mui/material";

import HoursTable from "./HoursTable";

const ContactInfo = () => {
  return (
    <Stack direction="column" alignItems="center" m={5} height={"500px"}>
      <Box
        sx={{
          backgroundColor: "#3c5d4e",
          color: "white",
          width: "100%",

          borderColor: "#3c5d4e",
          // m: 2,
          fontSize: "22px",
        }}
      >
        <Box sx={{ fontSize: "30px", margin: 2 }}>NORTH SHORE BIKE SHOP</Box>
        <Box sx={{ fontSize: "20px", margin: 2, fontWeight: "300" }}>
          North Vancouver
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: "white",
          color: "black",
          width: "100%",

          borderColor: "#3c5d4e",
          // m: 2,
        }}
      >
        <Box sx={{ fontSize: "20px", margin: 2, fontWeight: "300" }}>
          1831 Lonsdale Avenue <br /> North Vancouver, BC <br /> V7M 2J8
        </Box>
      </Box>
      <HoursTable></HoursTable>
    </Stack>
  );
};

export default ContactInfo;
