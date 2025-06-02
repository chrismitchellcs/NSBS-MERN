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

const EditBikeMaterial = ({ bike, setBikes }) => {
  const fetchBikes = async () => {
    console.log(process.env.REACT_APP_VERCEL_DOMAIN);
    await axios
      .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/`, {})
      .then((res) => {
        setBikes(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [material, setMaterial] = useState(bike.material);

  const handleMaterialChange = (e) => {
    e.preventDefault();
    const material = e.target.value;
    setMaterial(material);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newBike = bike;
    newBike.material = material;
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
          <b>Material: </b>
        </Box>
        <Box>{bike.material}</Box>
        <EditButton onClick={() => setEdit(true)}>Edit</EditButton>
      </Stack>
      {edit && (
        <RadioGroup
          onChange={handleMaterialChange}
          row
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="none"
          name="radio-buttons-group"
          value={material}
        >
          <FormControlLabel value="Carbon" control={<Radio />} label="Carbon" />
          <FormControlLabel value="Alloy" control={<Radio />} label="Alloy" />
          <FormControlLabel value="N/A" control={<Radio />} label="N/A" />
        </RadioGroup>
      )}
      {edit && <EditButton onClick={handleSubmit}>Save</EditButton>}
    </Stack>
  );
};

export default EditBikeMaterial;
