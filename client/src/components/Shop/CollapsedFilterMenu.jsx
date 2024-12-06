import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box } from "@mui/material";

const CollapsedFilterMenu = ({ name, bikeTypes, handleTypeClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display={{ xs: "block", sm: "block", md: "block", lg: "none" }}>
      <Button
        id="basic-button"
        sx={{
          fontSize: "16px",
          fontWeight: "300",
          bgcolor: "black",
          color: "white",
          ":hover": {
            bgcolor: "#4d5e5f", // theme.palette.primary.main
            color: "white",
          },
        }}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {name}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {bikeTypes.map((type) => (
          <MenuItem onClick={handleTypeClick} id={type}>
            {type}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default CollapsedFilterMenu;
