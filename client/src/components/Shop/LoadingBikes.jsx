import { Box, Skeleton } from "@mui/material";
import { bikeGridSx } from "./BikeGrid";

const PLACEHOLDER_COUNT = 12;

const LoadingBikes = () => (
  <Box sx={{ ...bikeGridSx, width: "100%" }} aria-busy="true" aria-label="Loading bikes">
    {Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
      <Skeleton key={i} variant="rounded" width="100%" height={290} animation="wave" />
    ))}
  </Box>
);

export default LoadingBikes;
