import { Box, Button, Fade, styled } from "@mui/material";
import React, { useEffect, useState } from "react";

const Sight160 = () => {
  const ShopButton = styled(Button)({
    backgroundColor: "#3c5d4e",
    margin: "3%",
    paddingLeft: "7%",
    paddingRight: "7%",
    paddingTop: "4%",
    paddingBottom: "4%",
    color: "white",
    maxHeight: "40px",
    fontWeight: "400",
    fontSize: "20px",

    "&:hover": {
      backgroundColor: "#4d5e5f",
      color: "white",
    },
  });

  const ShopButtonSmall = styled(Button)({
    backgroundColor: "#3c5d4e",
    margin: "3%",
    paddingLeft: "7%",
    paddingRight: "7%",
    paddingTop: "4%",
    paddingBottom: "4%",
    color: "white",
    maxHeight: "40px",
    fontWeight: "400",
    fontSize: "14px",

    "&:hover": {
      backgroundColor: "#4d5e5f",
      color: "white",
    },
  });

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <Fade in={show} timeout={1500}>
      <Box pb={5} textAlign={"center"}>
        <Fade in={show} timeout={3000}>
          <Box
            position={"absolute"}
            sx={{
              width: "38%",

              mt: { xs: 1, sm: 3, md: 10 },
              left: "50vw",

              textAlign: "center",

              color: "white",

              lineHeight: "1.5",
            }}
            fontWeight={{ xs: "500", sm: "400", md: "350" }}
            fontSize={{ xs: "16px", sm: "18px", md: "20px" }}
          >
            <Box
              component="img"
              sx={{
                width: "100%",
                mb: 0,
              }}
              alt="NSBS"
              src={"norco.svg"}
            />
            <Box
              sx={{ fontWeight: "600" }}
              fontSize={{ xs: "20px", sm: "30px", md: "35px" }}
            >
              NEW Sight 160, now with 170mm front and 160mm rear travel
            </Box>
            <Box display={{ xs: "none", sm: "none", md: "block" }}>
              <ShopButton href={`shop/norco`}>Shop Sale</ShopButton>
            </Box>
            <Box display={{ xs: "block", sm: "block", md: "none" }}>
              <ShopButtonSmall href={`shop/norco`}>Shop Sale</ShopButtonSmall>
            </Box>
          </Box>
        </Fade>

        <Box
          component="img"
          sx={{
            width: "100%",
            height: "58.65vw",

            mh: 5,
          }}
          alt="NSBS"
          src={"sight160.jpg"}
        />
      </Box>
    </Fade>
  );
};

export default Sight160;
