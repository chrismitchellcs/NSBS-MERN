import { Box, Stack, TextField } from "@mui/material";
import { useState } from "react";

const SearchBar = ({
  allBikes,
  setBikes,
  setCheckedBrands,
  setCheckedTypes,
  setPrice,
  price,
}) => {
  const [b, setB] = useState([]);

  const onChange = (e) => {
    setCheckedBrands([]);
    setCheckedTypes([]);

    var query = e.target.value;
    query = query.trim();
    query = query.toLowerCase();

    if (query.length > 0 && allBikes) {
      var bikes = [];

      // splits all bike names into arrays for each word
      allBikes.map((bike) => {
        if (bike.material == "N/A") {
          var fullName = bike.brand + " " + bike.name;
        } else {
          var fullName = bike.brand + " " + bike.name + " " + bike.material;
        }
        fullName = fullName.toLowerCase();
        const bikeArray = fullName.split(" ");
        bikes.push([bikeArray, bike._id]);
      });

      // splits each query word into an array
      const queryArray = query.split(" ");

      var queriedBikes = [];
      bikes.map((bike) => {
        var hits = 0;
        bike[0].map((word) => {
          var hit = false;

          queryArray.map((q) => {
            if (word.startsWith(q)) {
              hit = true;
            }
          });
          if (hit) {
            hits++;
          }
          console.log(word + hits);
        });
        console.log(bike + " has " + hits);
        if (hits == queryArray.length && bike.length) {
          console.log(bike);

          queriedBikes.push(bike);
        }
      });

      var finalBikes = [];
      const ids = queriedBikes.map((queriedBike) => {
        allBikes.map((bike) => {
          if (bike._id == queriedBike[1]) {
            finalBikes.push(bike);
          }
        });
      });
      console.log(ids);
      setPrice([0, 15000]);
      setBikes(finalBikes);
    } else {
      setPrice([0, 15000]);
      setBikes(allBikes);
    }
  };

  const colorArray = [
    "red",
    "orange",
    "violet",
    "green",
    "blue",
    "indigo",
    "yellow",
  ];

  return (
    <Box>
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        sx={{ mt: 5, ml: 2, mr: 2 }}
        onChange={onChange}
      />

      {/* <Stack direction="column">
        {b.map((bike) => {
          return (
            <Stack direction={"row"}>
              {bike.map((word, index) => {
                return <Box color={colorArray[index]}>{word}</Box>;
              })}
            </Stack>
          );
        })}
      </Stack> */}
    </Box>
  );
};

export default SearchBar;
