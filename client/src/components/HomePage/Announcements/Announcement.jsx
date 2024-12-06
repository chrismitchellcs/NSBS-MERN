import { Box, Button, Fade, styled } from "@mui/material";
import React, { useEffect, useState } from "react";

const Announcement = () => {
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
            width={{ xs: "60%", sm: "50%", md: "50%" }}
            sx={{
              mt: { xs: 1, sm: 3, md: 10 },
              ml: 1,
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
                width: "50%",
                mb: 0,
              }}
              alt="NSBS"
              src={"logobird.png"}
            />

            <Box
              mt={0}
              sx={{ fontWeight: "600" }}
              fontSize={{ xs: "14px", sm: "20px", md: "30px" }}
            >
              North Shore Bike Shop is now carrying Ibis Cycles!
            </Box>
            <Box display={{ xs: "none", sm: "none", md: "block" }}>
              <ShopButton href={`shop/ibis`}>Shop Sale</ShopButton>
            </Box>
            <Box display={{ xs: "block", sm: "block", md: "none" }}>
              <ShopButtonSmall href={`shop/ibis`}>Shop Sale</ShopButtonSmall>
            </Box>
          </Box>
        </Fade>

        <Box
          component="img"
          sx={{
            // borderRadius: "20px",
            width: "100%",
            // height: "52.776vw",

            mh: 5,
            //   ml: 30,
            //   mt: 10,
          }}
          alt="NSBS"
          src={"ibisann.jpg"}
        />
      </Box>
    </Fade>
  );
};

export default Announcement;
