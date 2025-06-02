import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
} from "@mui/material";
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

const allSizes = [
  '12"',
  '14"',
  '16"',
  '20"',
  '24"',
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "1",
  "2",
  "3",
  "4",
  "5",
];

const EditSizes = ({ bike, setBikes, sizes, target }) => {
  const [newSizes, setNewSizes] = useState([]);
  const [edit, setEdit] = useState(false);

  const [checked, setChecked] = useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

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

  const handleSave = async (e) => {
    e.preventDefault();
    let newBike = bike;
    newBike[target] = JSON.stringify(checked);
    await axios
      .patch(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${newBike._id}`,
        {
          newBike,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setChecked([]);
        fetchBikes();
        setEdit(false);
      })
      .catch((error) => {
        alert("bike not added");
      });
  };

  return (
    <Stack>
      {!edit && (
        <EditButton
          onClick={() => {
            setEdit(true);
          }}
        >
          Edit
        </EditButton>
      )}

      {edit && (
        <Stack>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {sizes.map((value) => {
              const labelId = `checkbox-list-label-${value}`;

              return (
                <ListItem key={value} disablePadding>
                  <ListItemButton
                    role={undefined}
                    onClick={handleToggle(value)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.includes(value)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={value} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <EditButton onClick={handleSave}>Save</EditButton>
        </Stack>
      )}
    </Stack>
  );
};

const EditBikeSizes = ({ bike, setBikes }) => {
  return (
    <Stack spacing={1}>
      <Stack direction={"row"} spacing={1} alignItems={"center"}>
        <Box>
          <b>Sizes (All): </b>
        </Box>
        {JSON.parse(bike.sizes).map((size) => {
          return (
            <Box bgcolor={"#D5D5D5"} p={1}>
              {size}
            </Box>
          );
        })}
        <EditSizes
          sizes={allSizes}
          target={"sizes"}
          bike={bike}
          setBikes={setBikes}
        ></EditSizes>
      </Stack>
      {/* <Stack direction={"row"} spacing={1} alignItems={"center"}>
        <Box>
          <b>Sizes (Available to Order): </b>
        </Box>
        {JSON.parse(bike.sizesa).map((size) => {
          return (
            <Box bgcolor={"#D5D5D5"} p={1}>
              {size}
            </Box>
          );
        })}
        <EditSizes
          sizes={JSON.parse(bike.sizes)}
          target={"sizesa"}
          bike={bike}
          setBikes={setBikes}
        ></EditSizes>
      </Stack> */}
      {/* <Stack direction={"row"} spacing={1} alignItems={"center"}>
        <Box>
          <b>Sizes (In Store): </b>
        </Box>
        {JSON.parse(bike.sizesis).map((size) => {
          return (
            <Box bgcolor={"#D5D5D5"} p={1}>
              {size}
            </Box>
          );
        })}
        <EditSizes
          sizes={JSON.parse(bike.sizes)}
          target={"sizesis"}
          bike={bike}
          setBikes={setBikes}
        ></EditSizes>
      </Stack> */}
    </Stack>
  );
};

export default EditBikeSizes;
