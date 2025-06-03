import { Box, Button, Stack, styled, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

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

const EditBikeDetail = ({ property, bike, setBikes }) => {
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(bike[property]);

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

  const handleSave = async () => {
    // create new bike with new value
    let newBike = bike;
    newBike[property] = value;

    await axios
      //   .patch(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${id}`, {
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

  return (
    <Stack direction={"row"}>
      {edit ? (
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <TextField
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          ></TextField>
          <EditButton onClick={handleSave}>Save</EditButton>
        </Stack>
      ) : (
        <EditButton onClick={() => setEdit(!edit)}>Edit</EditButton>
      )}
    </Stack>
  );
};

export default EditBikeDetail;
