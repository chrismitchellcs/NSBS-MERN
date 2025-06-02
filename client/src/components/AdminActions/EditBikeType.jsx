import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import { type } from "@testing-library/user-event/dist/type";
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

const EditBikeType = ({ bike, setBikes }) => {
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

  const [type, setType] = useState("");

  const handleTypeChange = (e) => {
    e.preventDefault();
    const type = e.target.value;
    setType(type);
    console.log(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newBike = bike;
    newBike.type = type;
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
      <Stack direction={"row"} alignItems={"center"}>
        <Box>
          <b>Type: </b>
          {bike.type}
        </Box>
        <EditButton onClick={() => setEdit(true)}>Edit</EditButton>
      </Stack>
      {edit && (
        <RadioGroup
          onChange={handleTypeChange}
          row
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="none"
          name="radio-buttons-group"
          value={type}
        >
          <FormControlLabel value="DH" control={<Radio />} label="DH" />
          <FormControlLabel
            value="Enduro / All Mountain"
            control={<Radio />}
            label="Enduro / All Mountain"
          />
          <FormControlLabel value="Trail" control={<Radio />} label="Trail" />
          <FormControlLabel value="XC" control={<Radio />} label="XC" />
          <FormControlLabel
            value="Dirt Jumper"
            control={<Radio />}
            label="Dirt Jumper"
          />
          <FormControlLabel
            value="Recreational"
            control={<Radio />}
            label="Recreational"
          />
          <FormControlLabel value="Kids" control={<Radio />} label="Kids" />
          <FormControlLabel value="E-Bike" control={<Radio />} label="E-Bike" />
        </RadioGroup>
      )}
      {edit && <EditButton onClick={handleSubmit}>Save</EditButton>}
    </Stack>
  );
};

export default EditBikeType;
