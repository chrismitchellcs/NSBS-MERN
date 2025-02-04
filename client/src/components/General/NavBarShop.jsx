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
  fontSize: "14px",

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

const NavBarShop = () => {
  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    const page = e.target.id;
    console.log(page);
    window.location.href = page;
  };

  return (
    <AppBar
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      position={"fixed"}
      style={{
        background: "white",
      }}
    >
      <StyledToolbar>
        <Stack direction={"row"} alignItems={"center"} spacing={5}>
          <Button style={{}} href="/">
            <Box
              component={"img"}
              src="/logo.png"
              width={{ xs: "60px", sm: "80px", md: "100px" }}
              // height={"60px"}
            ></Box>
          </Button>

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={5}
            display={{ xs: "none", sm: "block" }}
          >
            <NavButton href="/shop">Shop</NavButton>
            <NavButton href="/service">Service</NavButton>
            <NavButton href="/contact">Contact</NavButton>
          </Stack>
        </Stack>

        <Box display={{ xs: "none", sm: "block" }}>
          <NavButton href="/contact">
            <LocationOn></LocationOn>
          </NavButton>
        </Box>

        <Box display={{ xs: "block", sm: "none" }}>
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
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
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
      </StyledToolbar>
    </AppBar>
  );
};

export default NavBarShop;
