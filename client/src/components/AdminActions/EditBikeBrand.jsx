import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";

import axios from "axios";
import { useState } from "react";
import styled from "styled-components";

const EditButton = styled(Button)({
  backgroundColor: "transparent",
  color: "black",
  maxHeight: "40px",
  padding: "2px",
  fontSize: "14px",
  paddingLeft: "5px",
  paddingRight: "5px",
  minWidth: "0px",
  textTransform: "none",
  fontFamily: "Open Sans, sans-serif",
  letterSpacing: 0,
  fontWeight: "600",
  "&:hover": {
    textDecoration: "underline",
    textDecorationThickness: "2px",
    textUnderlineOffset: "5px",
    backgroundColor: "transparent",
    color: "black",
  },
});

const EditBikeBrand = ({ bike, setBikes }) => {
  const fetchBikes = async () => {
    console.log(process.env.REACT_APP_VERCEL_DOMAIN);
    await axios
      .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/`, {
        withCredentials: true,
      })
      .then((res) => {
        setBikes(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [brand, setBrand] = useState(bike.brand);

  const handleBrandChange = (e) => {
    e.preventDefault();
    const brand = e.target.value;
    setBrand(brand);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newBike = bike;
    newBike.brand = brand;
    await axios
      .patch(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${newBike._id}`,
        {
          newBike,
        },
        { withCredentials: true }
      )
      .then((res) => {
        fetchBikes();
        setEdit(false);
      })
      .catch((error) => {
        alert("bike not added");
      });
  };

  const [edit, setEdit] = useState(false);
  return (
    <Stack>
      <Stack direction={"row"} alignItems={"center"} spacing={1}>
        <Box>
          <b>Brand: </b>
        </Box>
        <Box>{bike.brand}</Box>
        <EditButton onClick={() => setEdit(true)}>Edit</EditButton>
      </Stack>
      {edit && (
        <RadioGroup
          onChange={handleBrandChange}
          row
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="none"
          name="radio-buttons-group"
          value={brand}
        >
          <FormControlLabel
            value="Transition"
            control={<Radio />}
            label="Transition"
          />
          <FormControlLabel value="Norco" control={<Radio />} label="Norco" />
          <FormControlLabel value="Ibis" control={<Radio />} label="Ibis" />
        </RadioGroup>
      )}
      {edit && <EditButton onClick={handleSubmit}>Save</EditButton>}
    </Stack>
  );
};

export default EditBikeBrand;
