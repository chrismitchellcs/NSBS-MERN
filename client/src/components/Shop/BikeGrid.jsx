import { Box } from "@mui/material";
import BikeCard from "./BikeCard";

/** Cards fill their column at every width; columns are at least 280px (or full width on phones). */
export const bikeGridSx = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
  gap: { xs: 2, md: 3 },
  alignItems: "start",
};

const BikeGrid = ({ bikes }) => {
  if (!bikes) return null;
  if (bikes.length === 0) {
    return (
      <Box
        sx={{
          maxWidth: 560,
          mx: "auto",
          textAlign: "center",
          fontSize: "20px",
          fontWeight: 300,
          mt: 5,
        }}
      >
        There are currently no options matching these filters on the website. We likely do have
        some options for you, get in contact with us and we can discuss!
      </Box>
    );
  }
  return (
    <Box sx={bikeGridSx}>
      {bikes.map((bike) => (
        <BikeCard key={bike._id} bike={bike} />
      ))}
    </Box>
  );
};

export default BikeGrid;
