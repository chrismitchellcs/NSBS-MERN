import { Box, Stack } from "@mui/material";

const DemoDay = () => {
  return (
    <Stack alignItems={"center"} pb={5} spacing={3}>
      <Box sx={{ fontSize: "40px" }}>Transition Demo Day</Box>
      <Box
        component="img"
        src="demoday.jpg"
        width={{ xs: "90%", sm: "90%", md: "40%" }}
      ></Box>
    </Stack>
  );
};

export default DemoDay;
