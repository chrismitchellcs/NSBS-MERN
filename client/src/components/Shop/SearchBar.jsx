import { Box, TextField } from "@mui/material";

const SearchBar = ({
  allBikes,
  setBikes,
  setCheckedBrands,
  setCheckedTypes,
  setPrice,
  price,
}) => {
  const onChange = (e) => {
    setCheckedBrands([]);
    setCheckedTypes([]);

    var query = e.target.value;
    query = query.trim();
    query = query.toLowerCase();

    if (query.length > 0 && allBikes) {
      var bikes = [];

      // splits all bike names into arrays for each word
      allBikes.forEach((bike) => {
        var fullName = "";
        if (bike.material === "N/A") {
          fullName = bike.brand + " " + bike.name;
        } else {
          fullName = bike.brand + " " + bike.name + " " + bike.material;
        }
        fullName = fullName.toLowerCase();
        const bikeArray = fullName.split(" ");
        bikes.push([bikeArray, bike._id]);
      });

      // splits each query word into an array
      const queryArray = query.split(" ");

      var queriedBikes = [];
      bikes.forEach((bike) => {
        var hits = 0;
        bike[0].forEach((word) => {
          var hit = false;

          queryArray.forEach((q) => {
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
        if (hits === queryArray.length && bike.length) {
          console.log(bike);

          queriedBikes.push(bike);
        }
      });

      var finalBikes = [];
      queriedBikes.forEach((queriedBike) => {
        allBikes.forEach((bike) => {
          if (bike._id === queriedBike[1]) {
            finalBikes.push(bike);
          }
        });
      });
      setPrice([0, 15000]);
      setBikes(finalBikes);
    } else {
      setPrice([0, 15000]);
      setBikes(allBikes);
    }
  };

  return (
    <Box>
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        sx={{ mt: 5, ml: 2, mr: 2 }}
        onChange={onChange}
      />
    </Box>
  );
};

export default SearchBar;
