import { Box, Button, Fade, styled } from "@mui/material";
import React, { useEffect, useState } from "react";

const Announcement = () => {
  const ShopButton = styled(Button)({
    backgroundColor: "#3c5d4e",
    color: "white",

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
              mt={{ xs: 0.2, sm: 0.4, md: 0.8 }}
              sx={{ fontWeight: "500" }}
              fontSize={{ xs: "12px", sm: "16px", md: "24px" }}
            >
              North Shore Bike Shop is now carrying Ibis Cycles!
            </Box>
            <Box m={{ xs: 0.5, sm: 1, md: 2 }}>
              <ShopButton href={`shop/ibis`}>
                <Box
                  p={{ xs: 0.2, sm: 0.4, md: 0.8 }}
                  fontSize={{ xs: "10px", sm: "14px", md: "16px" }}
                  textTransform={"none"}
                >
                  Shop Ibis
                </Box>
              </ShopButton>
            </Box>
          </Box>
        </Fade>

        <Box
          component="img"
          sx={{
            // borderRadius: "20px",
            width: "100%",
            // height: "52.776vw",
            height: "58.65vw",
            mh: 5,
            //   ml: 30,
            //   mt: 10,
          }}
          alt="NSBS"
          src={"ibisann-min.jpg"}
        />
      </Box>
    </Fade>
  );
};

export default Announcement;
