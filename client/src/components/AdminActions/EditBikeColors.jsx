import { Box, Button, Stack, styled, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

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

const EditColors = ({ bike, setBikes }) => {
  const [newColors, setNewColors] = useState(JSON.parse(bike.colors));
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    let newBike = bike;
    newBike.colors = JSON.stringify(newColors);
    await axios
      .patch(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${newBike._id}`,
        {
          newBike,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setEdit(false);
      })
      .catch((error) => {
        alert("bike not added");
      });
  };

  const addColor = (e) => {
    e.preventDefault();

    setNewColors([...newColors, value]);
    setValue("");
  };

  const deleteColor = (color) => {
    setNewColors((prevItems) => prevItems.filter((item) => item !== color));
  };

  return (
    <Stack>
      <Stack>
        {!edit && (
          <Stack spacing={1}>
            {newColors.map((color) => {
              return (
                <Stack
                  p={1}
                  direction={"row"}
                  alignItems={"center"}
                  bgcolor={"#D5D5D5"}
                  justifyContent={"space-between"}
                >
                  <Box>{color}</Box>{" "}
                </Stack>
              );
            })}
            <EditButton
              onClick={() => {
                setEdit(true);
              }}
            >
              Edit
            </EditButton>
          </Stack>
        )}
      </Stack>

      {edit && (
        <Stack>
          <Stack>
            <form onSubmit={addColor}>
              <Stack direction={"row"} alignItems={"center"}>
                <TextField
                  label="Color Name"
                  id="outlined-size-small"
                  defaultValue="Color Name"
                  size="small"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                />
                <EditButton type="submit">Add</EditButton>
              </Stack>
              <Stack>
                <Stack spacing={1}>
                  {newColors.map((color) => {
                    return (
                      <Stack
                        p={1}
                        direction={"row"}
                        alignItems={"center"}
                        bgcolor={"#D5D5D5"}
                        justifyContent={"space-between"}
                      >
                        <Box>{color}</Box>{" "}
                        <Button
                          key={color} // Always use a key when rendering lists
                          sx={{ p: 0, minWidth: 0, border: 0.5 }}
                          onClick={() => deleteColor(color)} // Event handler
                          id={color} // Set the id as the color value
                          color="error"
                        >
                          <CloseIcon sx={{ fontSize: "15px" }} />
                        </Button>
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
            </form>
          </Stack>
          <EditButton onClick={handleSave}>Save</EditButton>
        </Stack>
      )}
    </Stack>
  );
};

const EditBikeColors = ({ bike, setBikes }) => {
  return (
    <Stack spacing={1}>
      <Stack direction={"row"} spacing={1}>
        <Box>
          <b>Colors (All): </b>
        </Box>
        {/* {JSON.parse(bike.colors).map((size) => {
          return (
            <Box bgcolor={"#D5D5D5"} p={1}>
              {size}
            </Box>
          );
        })} */}
        <EditColors bike={bike} setBikes={setBikes}></EditColors>
      </Stack>
    </Stack>
  );
};

export default EditBikeColors;
