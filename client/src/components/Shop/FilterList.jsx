import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

import { Box } from "@mui/material";

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
    allBikes.forEach((bike) => {
      if (newChecked.length === 0) {
        if (checkedTypes.length === 0) {
          queriedBikes.push(bike);
        } else {
          let added = false;
          checkedTypes.forEach((type) => {
            if (bike.type === type && !added) {
              added = true;
              queriedBikes.push(bike);
            }
          });
        }
      } else {
        if (checkedTypes.length === 0) {
          let added = false;
          newChecked.forEach((brand) => {
            if (bike.brand === brand && !added) {
              added = true;
              queriedBikes.push(bike);
            }
          });
        } else {
          let added = false;
          newChecked.forEach((brand) => {
            checkedTypes.forEach((type) => {
              if (bike.brand === brand && bike.type === type && !added) {
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
    allBikes.forEach((bike) => {
      if (newChecked.length === 0) {
        if (checkedBrands.length === 0) {
          queriedBikes.push(bike);
        } else {
          let added = false;
          checkedBrands.forEach((brand) => {
            if (bike.brand === brand && !added) {
              added = true;
              queriedBikes.push(bike);
            }
          });
        }
      } else {
        if (checkedBrands.length === 0) {
          let added = false;
          newChecked.forEach((type) => {
            if (bike.type === type && !added) {
              added = true;
              queriedBikes.push(bike);
            }
          });
        } else {
          let added = false;
          newChecked.forEach((type) => {
            checkedBrands.forEach((brand) => {
              if (bike.type === type && bike.brand === brand && !added) {
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
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <Checkbox
                    edge="start"
                    checked={checkedBrands.includes(value)}
                    tabIndex={-1}
                    disableRipple
                    sx={{
                      pt: 0,
                      pb: 0,
                      transform: "scale(0.8)", // scales checkbox to 80% size
                    }}
                    inputProps={{ "aria-labelledby": labelId }}
                    style={{ color: "#3c5d4e" }}
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
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <Checkbox
                    edge="start"
                    checked={checkedTypes.includes(value)}
                    tabIndex={-1}
                    disableRipple
                    sx={{
                      pt: 0,
                      pb: 0,
                      transform: "scale(0.8)", // scales checkbox to 80% size
                    }}
                    inputProps={{ "aria-labelledby": labelId }}
                    style={{ color: "#3c5d4e" }}
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
