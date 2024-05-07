import { Box, Stack } from "@mui/material";

const HoursTable = () => {
  return (
    <Box
      bgcolor={"#3c5d4e"}
      width={"100%"}
      borderColor={"#3c5d4e"}
      fontSize={"18px"}
      fontWeight={"300"}
      color={"white"}
      height={"100%"}
      pt={2}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack direction={"row"} justifyContent={"space-evenly"}>
        <Stack spacing={1} fontWeight={"400"}>
          <Box height={"20px"}> </Box>
          <Box>Sunday</Box>
          <Box>Monday</Box>
          <Box>Tuesday</Box>
          <Box>Wednesday</Box>
          <Box>Thursday</Box>
          <Box>Friday</Box>
          <Box>Saturday</Box>
        </Stack>
        <Stack spacing={1}>
          <Box fontWeight={"400"}>Open</Box>
          <Box>11:00 AM</Box>
          <Box>11:00 AM</Box>
          <Box>11:00 AM</Box>
          <Box>11:00 AM</Box>
          <Box>11:00 AM</Box>
          <Box>11:00 AM</Box>
          <Box>10:00 AM</Box>
        </Stack>
        <Stack spacing={1}>
          <Box fontWeight={"400"}>Close</Box>
          <Box>4:00 PM</Box>
          <Box>7:00 PM</Box>
          <Box>7:00 PM</Box>
          <Box>7:00 PM</Box>
          <Box>7:00 PM</Box>
          <Box>7:00 PM</Box>
          <Box>6:00 PM</Box>
          <Box></Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default HoursTable;
