import { Box, Grid } from "@mui/material";
import BikeButton from "./BikeButton";

const BikeGrid = ({ bikes }) => {
  return (
    <Box>
      <Grid container>
        {bikes &&
          bikes.map((bike) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={4} textAlign={"center"}>
                <BikeButton bike={bike}></BikeButton>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
};

export default BikeGrid;
