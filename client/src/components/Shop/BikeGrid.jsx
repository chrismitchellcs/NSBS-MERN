import { Box, Grid, Stack } from "@mui/material";
import BikeCard from "./BikeCard";

const BikeGrid = ({ bikes }) => {
  const Bikes = () => {
    if (bikes.length === 0) {
      return (
        <Stack width={"100%"} alignItems={"center"} justifyContent={"center"}>
          <Box
            width={"60%"}
            textAlign={"center"}
            fontSize={"20px"}
            fontWeight={"300"}
            mt={5}
          >
            There are currently no options in this category on the website. We
            likely do have some options for you, get in contact with us and we
            can discuss!
          </Box>
        </Stack>
      );
    } else if (bikes.length === 2) {
      return (
        <Grid container spacing={2}>
          {bikes.map((bike) => {
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                textAlign={"center"}
                key={bike._id}
              >
                <Box sx={{ display: "inline-block" }}>
                  <BikeCard bike={bike} />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      );
    } else {
      return (
        <Grid container spacing={2}>
          {bikes.map((bike) => {
            return (
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={4}
                xl={3}
                textAlign={"center"}
                key={bike._id}
                sx={{
                  justifyContent: "center",
                }}
              >
                <Box sx={{ display: "inline-block" }}>
                  <BikeCard bike={bike} />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      );
    }
  };

  return <Box>{bikes && <Bikes></Bikes>}</Box>;
};

export default BikeGrid;
