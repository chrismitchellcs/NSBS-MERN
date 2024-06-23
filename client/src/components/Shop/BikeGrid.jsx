import { Box, Grid, Stack } from "@mui/material";
import BikeButton from "./BikeButton";
import { useEffect, useState } from "react";

const BikeGrid = ({ bikes }) => {
  const [hasBike, setHasBike] = useState(true);

  const Bikes = () => {
    return (
      <Grid container>
        {bikes.length > 0 ? (
          bikes.map((bike) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={4} textAlign={"center"}>
                <BikeButton bike={bike}></BikeButton>
              </Grid>
            );
          })
        ) : (
          <Stack
            width={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
            m={10}
          >
            <Box
              width={"60%"}
              textAlign={"center"}
              fontSize={"20px"}
              fontWeight={"300"}
            >
              There are currently no options in this category on the website. We
              likely do have some options for you, get in contact with us and we
              can discuss!
            </Box>
          </Stack>
        )}
      </Grid>
    );
  };

  return (
    <Box>{bikes && <Bikes></Bikes>}</Box>
    // <Box>
    //   <Grid container>
    //     {bikes &&
    //       bikes.map((bike) => {
    //         return (
    //           <Grid item xs={12} sm={6} md={4} lg={4} textAlign={"center"}>
    //             <BikeButton bike={bike}></BikeButton>
    //           </Grid>
    //         );
    //       })}
    //   </Grid>
    // </Box>
  );
};

export default BikeGrid;
