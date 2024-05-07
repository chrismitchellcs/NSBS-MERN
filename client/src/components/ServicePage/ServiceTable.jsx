import { Box, Stack } from "@mui/material";

const ServiceTable = () => {
  return (
    <Stack direction={"column"} spacing={3}>
      <Stack direction={"row"} justifyContent={"space-evenly"}>
        <Box>Minimum Charge</Box>
        <Box>$15</Box>
      </Stack>

      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        textAlign={"center"}
      >
        <Box>Tube / Tire install</Box>
        <Box>$15</Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        textAlign={"center"}
      >
        <Box>Install Cushcore / Tire Insert</Box>
        <Box>$20 - $30</Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        textAlign={"center"}
      >
        <Box>Drivetrain adjustment</Box>
        <Box>$25 - $40</Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        textAlign={"center"}
      >
        <Box>Drivetrain adjustment</Box>
        <Box>$25 - $40</Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        textAlign={"center"}
      >
        <Box>Brake Adjustment / Replace Pads</Box>
        <Box>$25</Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        textAlign={"center"}
      >
        <Box>Brake Bleed</Box>
        <Box>$40</Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        textAlign={"center"}
      >
        <Box>Wheel True / Spoke Replacement</Box>
        <Box>$35 - 55</Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        textAlign={"center"}
      >
        <Box>Wheel Build (includes spokes, nipples, and tape)</Box>
        <Box>$145</Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        textAlign={"center"}
      >
        <Box>Hub Service</Box>
        <Box>$45 - $65</Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        textAlign={"center"}
      >
        <Box>Headset Install</Box>
        <Box>$40</Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        textAlign={"center"}
      >
        <Box>Bottom Bracket Install</Box>
        <Box>$40</Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        textAlign={"center"}
      >
        <Box>50hr Shock Air Can Service</Box>
        <Box>$75</Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        textAlign={"center"}
      >
        <Box>50hr Fork Lowers Service</Box>
        <Box>$90</Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        textAlign={"center"}
      >
        <Box>Suspension Full Service</Box>
        <Box>$190 - 260</Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-evenly"}
        textAlign={"center"}
      >
        <Box>Pivot Bearing Replacement</Box>
        <Box>$225</Box>
      </Stack>
    </Stack>
  );
};

export default ServiceTable;
