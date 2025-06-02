import { Box, Button, Fade, styled } from "@mui/material";
import React, { useEffect, useState } from "react";

const Sight160 = () => {
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
              mt={{ xs: 0.2, sm: 0.4, md: 0.8 }}
              sx={{ fontWeight: "500" }}
              fontSize={{ xs: "12px", sm: "16px", md: "24px" }}
            >
              The new Norco Sight 160. 170mm/160mm travel for BC-inspired
              trails.
            </Box>
            <Box m={{ xs: 0.5, sm: 1, md: 2 }}>
              <ShopButton href={`shop/norco`}>
                <Box
                  p={{ xs: 0.2, sm: 0.4, md: 0.8 }}
                  fontSize={{ xs: "10px", sm: "14px", md: "16px" }}
                  textTransform={"none"}
                >
                  Shop Norco
                </Box>
              </ShopButton>
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
