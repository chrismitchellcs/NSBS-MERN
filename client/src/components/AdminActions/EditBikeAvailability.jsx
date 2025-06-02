import { Alert, Box, Button, Stack, styled } from "@mui/material";
import axios from "axios";
import { useState } from "react";

const AvailabilityButton = styled(Button)({
  textTransform: "none",
  fontFamily: "Open Sans, sans-serif",
  color: "black",

  width: "100%",
  "&:hover": {},
});

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

const EditBikeAvailability = ({ bike, setBikes }) => {
  const [alert, setAlert] = useState(false);
  const [badAlert, setBadAlert] = useState(false);

  const initializeData = () => {
    let data = {};
    if (bike.availability === undefined) {
      JSON.parse(bike.colors).forEach((color) => {
        data[color] = {};
        JSON.parse(bike.sizes).forEach((size) => {
          data[color][size] = "Unavailable"; // Default value, can be updated later
        });
      });
    } else {
      data = JSON.parse(bike.availability);
    }
    return data;
  };

  const [availability, setAvailability] = useState(initializeData);

  const updateValue = (color, size) => {
    let newValue = "";
    const curAvailability = availability[color][size];

    if (curAvailability === "Unavailable") {
      newValue = "Available";
    } else if (curAvailability === "Available") {
      newValue = "In Stock";
    } else {
      newValue = "Unavailable";
    }

    setAvailability((prevData) => ({
      ...prevData,
      [color]: {
        ...prevData[color],
        [size]: newValue,
      },
    }));
  };

  const stockColors = {
    Unavailable: "#ffe6e7",
    Available: "#F5F5F5",
    "In Stock": "#e6ffef",
  };

  const handleSave = async () => {
    let newBike = bike;
    newBike.availability = JSON.stringify(availability);
    await axios
      .patch(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${newBike._id}`,
        {
          newBike,
        },
        { withCredentials: true }
      )
      .then((res) => {})
      .catch((error) => {
        setBadAlert(true);
        setTimeout(() => {
          setBadAlert(false); // Clear the state after the duration
        }, 2000);
      });
    setAlert(true);
    setTimeout(() => {
      setAlert(false); // Clear the state after the duration
    }, 2000);
  };

  return (
    <Stack>
      <Stack direction={"row"}>
        {JSON.parse(bike.colors).map((color) => (
          <Stack p={1} spacing={1} justifyContent={"flex-end"}>
            <Box>{color}</Box>
            <Stack spacing={1}>
              {JSON.parse(bike.sizes).map((size) => (
                <Box bgcolor={stockColors[availability[color][size]]}>
                  <AvailabilityButton
                    onClick={() => {
                      updateValue(color, size);
                    }}
                  >
                    <Stack>
                      <Box>{size}</Box> <Box>{availability[color][size]}</Box>
                    </Stack>
                  </AvailabilityButton>
                </Box>
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
      <EditButton onClick={handleSave}>Save</EditButton>
      {badAlert && (
        <Alert sx={{ m: 1 }} severity="error">
          Availability Not Saved
        </Alert>
      )}
      {alert && (
        <Alert sx={{ m: 1 }} severity="success">
          Availability Saved
        </Alert>
      )}
    </Stack>
  );
};

export default EditBikeAvailability;
