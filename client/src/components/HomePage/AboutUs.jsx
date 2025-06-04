import { Box, Button, Fade, Stack, styled } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import EmailIcon from "@mui/icons-material/Email";

import React, { useEffect, useState } from "react";

const ServiceButton = styled(Button)({
  backgroundColor: "transparent",
  color: "#555555",
  maxHeight: "40px",

  fontSize: "16px",
  fontWeight: "550",
  textTransform: "none",
  fontFamily: "Open Sans, sans-serif",
  letterSpacing: 0,
  textDecoration: "underline",
  textDecorationThickness: "2px",
  textUnderlineOffset: "10px",
  padding: 0,

  "&:hover": {
    color: "#3c5d4e",
    textDecoration: "underline",
    textDecorationThickness: "2px",
    textUnderlineOffset: "10px",
    backgroundColor: "transparent",
  },
});

const ServiceButtonSelected = styled(Button)({
  backgroundColor: "transparent",
  color: "#3c5d4e",
  maxHeight: "40px",

  fontSize: "18px",
  fontWeight: "550",
  textTransform: "none",
  fontFamily: "Open Sans, sans-serif",
  letterSpacing: 0,
  textDecoration: "underline",
  textDecorationThickness: "2px",
  textUnderlineOffset: "10px",
  padding: 0,
  "&:hover": {
    color: "#3c5d4e",
    textDecoration: "underline",
    textDecorationThickness: "2px",
    textUnderlineOffset: "10px",
    backgroundColor: "transparent",
  },
});

const AboutButton = styled(Button)({
  textTransform: "none",
  backgroundColor: "#3c5d4e",
  color: "white",
  padding: "10px",
  paddingLeft: "20px",
  paddingRight: "20px",
  fontSize: "16px",
  fontWeight: "450",
  borderRadius: "100px",
  fontFamily: "Open Sans, sans-serif",
  letterSpacing: 0,
  marginTop: "10px",
  "&:hover": {
    backgroundColor: "#4d5e5f",
  },
});

const AboutUs = () => {
  const [showTolling, setShowTolling] = useState(true);
  const [showProducts, setShowProducts] = useState(false);
  const [showServices, setShowServices] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    const sel = e.target.id;
    if (sel === "tolling") {
      setShowProducts(false);
      setShowServices(false);
      setShowTolling(true);
    } else if (sel === "products") {
      setShowTolling(false);
      setShowServices(false);
      setShowProducts(true);
    } else {
      setShowTolling(false);
      setShowProducts(false);
      setShowServices(true);
    }
  };

  return (
    <Stack
      pt={5}
      pb={5}
      alignItems={"center"}
      sx={{ bgcolor: "#F5F5F5" }}
      spacing={4}
    >
      <Stack
        width={{ xs: "90%", sm: "80%", md: "75%" }}
        alignItems={{ xs: "center", md: "flex-start" }}
      >
        <Stack direction={"row"} spacing={3}>
          {showTolling ? (
            <ServiceButtonSelected onClick={handleClick} id="tolling">
              Shop Bikes
            </ServiceButtonSelected>
          ) : (
            <ServiceButton onClick={handleClick} id="tolling">
              Shop Bikes
            </ServiceButton>
          )}
          {/* <ServiceButton onClick={handleClick} id="tolling">
            HPP Tolling
          </ServiceButton> */}
          {showProducts ? (
            <ServiceButtonSelected onClick={handleClick} id="products">
              Service
            </ServiceButtonSelected>
          ) : (
            <ServiceButton onClick={handleClick} id="products">
              Service
            </ServiceButton>
          )}
          {showServices ? (
            <ServiceButtonSelected onClick={handleClick} id="services">
              Contact Us
            </ServiceButtonSelected>
          ) : (
            <ServiceButton onClick={handleClick} id="services">
              Contact Us
            </ServiceButton>
          )}
        </Stack>
      </Stack>
      <Box width={"75%"}>
        {showTolling && (
          <Fade in={showTolling} timeout={1500}>
            <Stack spacing={2}>
              <Box fontSize={{ xs: "24px", md: "26px" }} fontWeight={"450"}>
                Shop Mountain Bikes at NSBS
              </Box>
              <Box
                fontSize={{ xs: "16px", md: "18px" }}
                sx={{ fontWeight: "350", lineHeight: 1.4 }}
              >
                Find your next ride at North Shore Bike Shop! Whether you're
                looking for your first mountain bike or a high-performance rig,
                we've got you covered. Explore our selection of Transition,
                Norco, and Ibis bikes.
              </Box>
              <Box>
                <AboutButton href="/shop">See the Bikes</AboutButton>
              </Box>
            </Stack>
          </Fade>
        )}
        {showProducts && (
          <Fade in={showProducts} timeout={1500}>
            <Stack spacing={2}>
              <Box fontSize={{ xs: "24px", md: "26px" }} fontWeight={"450"}>
                Bike Service & Repairs at NSBS
              </Box>
              <Box
                fontSize={{ xs: "16px", md: "18px" }}
                sx={{ fontWeight: "350", lineHeight: 1.4 }}
              >
                Keep your ride in top shape with North Shore Bike Shop's expert
                service! We work on all types of mountain bikes, offering fast
                turnaround times, unbeatable labor rates, and a fully stocked
                selection of parts. Whether it's a simple tune-up or a full
                overhaul, we've got you covered.
              </Box>
              <Box>
                <AboutButton href="/service">Service Info</AboutButton>
              </Box>
            </Stack>
          </Fade>
        )}
        {showServices && (
          <Fade in={showServices} timeout={1500}>
            <Stack spacing={2}>
              <Box fontSize={{ xs: "24px", md: "26px" }} fontWeight={"450"}>
                Get in Touch with NSBS
              </Box>
              <Box
                fontSize={{ xs: "16px", md: "18px" }}
                sx={{ fontWeight: "350", lineHeight: 1.4 }}
              >
                Have questions or need assistance? We're here to help! Whether
                you're looking for a new bike, need service, or just want expert
                advice, North Shore Bike Shop has you covered.
              </Box>
              <Stack>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  spacing={2}
                  fontSize={{ xs: "14px", md: "16px" }}
                  sx={{ fontWeight: "350", lineHeight: 1.4 }}
                >
                  <LocationOnIcon fontSize="medium" />
                  <Box>1831 Lonsdale Avenue, North Vancouver, BC V7M 2J8</Box>
                </Stack>
              </Stack>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={2}
                fontSize={{ xs: "14px", md: "16px" }}
                sx={{ fontWeight: "350", lineHeight: 1.4 }}
              >
                <PhoneIphoneIcon fontSize="medium" />
                <Box>(604) 929-6727</Box>
              </Stack>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={2}
                fontSize={{ xs: "14px", md: "16px" }}
                sx={{ fontWeight: "350", lineHeight: 1.4 }}
              >
                <EmailIcon fontSize="medium" />
                <Box>northshorebikeshop@gmail.com</Box>
              </Stack>
              <Box>
                <AboutButton href="/contact">Contact Us</AboutButton>
              </Box>
            </Stack>
          </Fade>
        )}
      </Box>
    </Stack>
  );
};

export default AboutUs;
