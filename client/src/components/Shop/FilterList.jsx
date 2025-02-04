import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox, { checkboxClasses } from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import { Box } from "@mui/material";
import { all } from "axios";

export default function CheckboxList({
  bikeTypes,
  bikeBrands,
  allBikes,
  setBikes,
  checkedBrands,
  setCheckedBrands,
  checkedTypes,
  setCheckedTypes,
  price,
  setPrice,
}) {
  //   const [checkedBrands, setCheckedBrands] = React.useState([]);
  //   const [checkedTypes, setCheckedTypes] = React.useState([]);

  const handleBrandToggle = (value) => () => {
    const currentIndex = checkedBrands.indexOf(value);
    const newChecked = [...checkedBrands];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedBrands(newChecked);

    // change bikes to only checked bikes

    var queriedBikes = [];
    console.log("new checked: " + newChecked.length);
    console.log("checked types: " + checkedTypes.length);
    allBikes.map((bike) => {
      if (newChecked.length == 0) {
        if (checkedTypes.length == 0) {
          queriedBikes.push(bike);
        } else {
          let added = false;
          checkedTypes.map((type) => {
            if (bike.type == type && !added) {
              added = true;
              queriedBikes.push(bike);
            }
          });
        }
      } else {
        if (checkedTypes.length == 0) {
          let added = false;
          newChecked.map((brand) => {
            if (bike.brand == brand && !added) {
              added = true;
              queriedBikes.push(bike);
            }
          });
        } else {
          let added = false;
          console.log(newChecked);
          console.log(bikeTypes);
          newChecked.map((brand) => {
            checkedTypes.map((type) => {
              if (bike.brand == brand && bike.type == type && !added) {
                added = true;
                queriedBikes.push(bike);
              }
            });
          });
        }
      }
    });
    setPrice([0, 15000]);
    setBikes(queriedBikes);
  };

  const handleTypeToggle = (value) => () => {
    const currentIndex = checkedTypes.indexOf(value);
    const newChecked = [...checkedTypes];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedTypes(newChecked);

    // change bikes to only checked bikes

    var queriedBikes = [];
    console.log("new checked: " + newChecked.length);
    console.log("checked brands: " + checkedBrands.length);
    allBikes.map((bike) => {
      if (newChecked.length == 0) {
        if (checkedBrands.length == 0) {
          queriedBikes.push(bike);
        } else {
          let added = false;
          checkedBrands.map((brand) => {
            if (bike.brand == brand && !added) {
              added = true;
              queriedBikes.push(bike);
            }
          });
        }
      } else {
        if (checkedBrands.length == 0) {
          let added = false;
          newChecked.map((type) => {
            if (bike.type == type && !added) {
              added = true;
              queriedBikes.push(bike);
            }
          });
        } else {
          let added = false;
          newChecked.map((type) => {
            checkedBrands.map((brand) => {
              if (bike.type == type && bike.brand == brand && !added) {
                added = true;
                queriedBikes.push(bike);
              }
            });
          });
        }
      }
    });
    setPrice([0, 15000]);
    setBikes(queriedBikes);
  };

  return (
    <Box>
      <Box mt={2} ml={2} fontWeight={700}>
        BRAND
      </Box>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          maxHeight: 150,
          overflowY: "scroll",
        }}
      >
        {bikeBrands.map((value) => {
          const labelId = value;

          return (
            <ListItem key={value} sx={{ m: 0 }} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={handleBrandToggle(value)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checkedBrands.includes(value)}
                    tabIndex={-1}
                    disableRipple
                    sx={{ pt: 0, pb: 0 }}
                    inputProps={{ "aria-labelledby": labelId }}
                    style={{
                      color: "#3c5d4e",
                    }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={value} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box mt={2} ml={2} fontWeight={700}>
        TYPE
      </Box>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
      >
        {bikeTypes.map((value) => {
          const labelId = value;
          return (
            <ListItem key={value} sx={{ m: 0 }} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={handleTypeToggle(value)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checkedTypes.includes(value)}
                    tabIndex={-1}
                    disableRipple
                    sx={{ pt: 0, pb: 0 }}
                    inputProps={{ "aria-labelledby": labelId }}
                    style={{
                      color: "#3c5d4e",
                    }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={value} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
