import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Button, Stack, styled, TextField } from "@mui/material";

function valuetext(value) {
  return `${value}°C`;
}

const minDistance = 1000;

const SubmitButton = styled(Button)({
  width: "100%",
  textTransform: "none",
  color: "#3c5d4e",
  maxHeight: "40px",
  fontWeight: "500",
  fontSize: "14px",
  padding: "0px",
  paddingTop: "2px",
  paddingLeft: "5px",
  paddingBottom: "2px",
  justifyContent: "center",

  "&:hover": {
    backgroundColor: "lightgrey",
  },
});

export default function MinimumDistanceSlider({
  bikes,
  allBikes,
  setBikes,
  setPrice,
  price,
}) {
  React.useEffect(() => {
    setValue2(price);
  }, [price]);

  const [cutBikes, setCutBikes] = React.useState([]);
  const [value2, setValue2] = React.useState([0, 15000]);

  // change lower bound for price
  const handleTextChange1 = (event) => {
    setValue2([event.target.value, value2[1]]);
  };

  // change upper bound for price
  const handleTextChange2 = (event) => {
    let max = event.target.value;
    setValue2([value2[0], max]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let min = value2[0];
    let max = value2[1];
    // @ts-ignore
    if (value2[1] == "") {
      max = 15000;
      setValue2([min, max]);
    }
    // @ts-ignore
    if (value2[0] == "") {
      min = 0;
      setValue2([min, max]);
    }
    let newBikes = [];
    let cutBikesTemp = cutBikes;
    let tempBikes = new Set([...bikes, ...cutBikes]);
    let tempBikesArray = [...tempBikes];
    tempBikesArray.map((bike) => {
      if (bike.saleprice === null || bike.saleprice === undefined) {
        if (value2[0] <= bike.price && bike.price <= max) {
          newBikes.push(bike);
        } else {
          if (!cutBikesTemp.includes(bike)) {
            cutBikesTemp.push(bike);
          }
        }
      } else {
        if (value2[0] <= bike.saleprice && bike.saleprice <= max) {
          newBikes.push(bike);
        } else {
          if (!cutBikesTemp.includes(bike)) {
            cutBikesTemp.push(bike);
          }
        }
      }
    });
    setBikes(newBikes);
  };

  return (
    <Box
      sx={{
        width: 200,
        justifySelf: "center",
      }}
    >
      <form onSubmit={onSubmit}>
        <Stack justifySelf={"center"} direction={"row"}>
          <TextField
            sx={{ m: 1 }}
            value={value2[0]}
            onChange={handleTextChange1}
            label={"Min"}
            variant="standard"
          />
          <TextField
            sx={{ m: 1 }}
            value={value2[1]}
            onChange={handleTextChange2}
            label={"Min"}
            variant="standard"
          />
          {/* <TextField
            sx={{ mt: 0.5, mb: 0.5, mr: 0.25 }}
            id="min-price"
            label="Min"
            size="small"
            onChange={handleTextChange1}
          />
          <TextField
            sx={{ mt: 0.5, mb: 0.5, ml: 0.25 }}
            id="max-price"
            label="Max"
            size="small"
            onChange={handleTextChange2}
          /> */}
        </Stack>
        <SubmitButton type={"submit"}>Update Price</SubmitButton>
      </form>

      {/* <Slider
        min={0}
        max={15000}
        getAriaLabel={() => "Minimum distance shift"}
        value={value2}
        onChange={handleChange2}
        valueLabelDisplay="off"
        getAriaValueText={valuetext}
        disableSwap
        style={{ color: "#3c5d4e" }}
      /> */}
    </Box>
  );
}
