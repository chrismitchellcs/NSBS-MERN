import styled from "@emotion/styled";
import { LocationOn } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
} from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

const StyledToolbar = styled(Toolbar)({
  justifyContent: "space-between",
  alignItems: "center",
  display: "flex",
  margin: 10,
});

const NavButton = styled(Button)({
  backgroundColor: "transparent",
  color: "black",
  maxHeight: "40px",
  margin: "10px",
  fontSize: "16px",
  fontWeight: "400",

  "&:hover": {
    textDecoration: "underline",
    textDecorationThickness: "2px",
    textUnderlineOffset: "5px",
    backgroundColor: "transparent",
    color: "black",
  },
});

const MenuButton = styled(Button)({
  backgroundColor: "transparent",
  color: "black",
  maxHeight: "40px",
  margin: "10px",

  "&:hover": {
    backgroundColor: "transparent",
    color: "#3c52b2",
  },
});

const NavBar = ({ background, position, displayLogo }) => {
  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    const page = e.target.id;
    console.log(page);
    window.location.href = page;
  };

  return (
    <AppBar
      position={position}
      style={{ background: background, boxShadow: "none" }}
    >
      <StyledToolbar>
        <Stack direction={"row"} alignItems={"center"} spacing={5}>
          <Box display={{ xs: "block", sm: "block", md: "none" }}>
            <MenuButton onClick={(e) => setOpen(true)}>
              <MenuIcon></MenuIcon>
            </MenuButton>
            <Menu
              id="basic-menu"
              open={open}
              onClose={(e) => setOpen(false)}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={handleClick} id="shop">
                Shop
              </MenuItem>

              <MenuItem onClick={handleClick} id="service">
                Service
              </MenuItem>
              <MenuItem onClick={handleClick} id="contact">
                Contact
              </MenuItem>
            </Menu>
          </Box>
          {displayLogo ? (
            <Box component={"img"} src="logo.png" width={"150px"}></Box>
          ) : (
            ""
          )}
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={5}
            display={{ xs: "none", sm: "none", md: "block" }}
          >
            <NavButton href="/shop">Shop</NavButton>
            <NavButton href="/service">Service</NavButton>
            <NavButton href="/contact">Contact</NavButton>
          </Stack>
        </Stack>

        <Box>
          <NavButton href="/contact">
            <LocationOn></LocationOn>
          </NavButton>
        </Box>
      </StyledToolbar>
    </AppBar>
  );
};

export default NavBar;
