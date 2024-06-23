import { Box, Button, Stack, styled } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";

const SMButton = styled(Button)({
  backgroundColor: "transparent",
  color: "black",
  borderRadius: "10px",

  "&:hover": {
    backgroundColor: "#bbbbbb",
    color: "#black",
  },
});

const Closer = () => {
  const CloserButton = styled(Button)({
    backgroundColor: "transparent",
    color: "black",
    textAlign: "left",
    fontWeight: "300",
    textTransform: "none",
    justifyContent: "left",
    fontSize: "14px",

    "&:hover": {
      backgroundColor: "transparent",
      color: "black",
    },
  });

  return (
    <Box
      sx={{}}
      // bgcolor={"#f1f2f6"}

      bgcolor={"#EAEAEA"}
      color={"black"}
      width={"100%"}
      fontSize={"14px"}
      fontWeight={"300"}
      lineHeight={"1.5"}
    >
      <Stack
        direction={{ xs: "column", sm: "row", md: "row" }}
        justifyContent="space-evenly"
        alignItems="center"
        p={2}
      >
        <Stack spacing={2}>
          <CloserButton href="contact">
            <Stack
              display={{ xs: "none", sm: "flex" }}
              direction={"row"}
              alignItems={"center"}
              spacing={2}
            >
              <LocationOnIcon fontSize="medium" />

              <Box>
                1831 Lonsdale Avenue <br></br> North Vancouver, BC <br /> V7M
                2J8
              </Box>
            </Stack>
          </CloserButton>
        </Stack>
        <Stack spacing={1}>
          <CloserButton href="contact">
            <Stack
              display={{ sm: "none" }}
              direction={"row"}
              alignItems={"center"}
              spacing={2}
            >
              <LocationOnIcon fontSize="medium" />
              <Box>
                1831 Lonsdale Avenue <br></br> North Vancouver, BC <br /> V7M
                2J8
              </Box>
            </Stack>
          </CloserButton>
          <CloserButton>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <LocalPhoneIcon fontSize="medium" />
              <Box>(604) 929-6727</Box>
            </Stack>
          </CloserButton>
          <CloserButton>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <PhoneIphoneIcon fontSize="medium" />
              <Box>(604) 929-6727</Box>
            </Stack>
          </CloserButton>
          <CloserButton>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <EmailIcon fontSize="medium" />
              <Box>northshorebikeshop@gmail.com</Box>
            </Stack>
          </CloserButton>
        </Stack>
        <Stack
          spacing={1}
          direction={{ xs: "row", sm: "column" }}
          mt={{ xs: 2 }}
        >
          <SMButton>
            <InstagramIcon sx={{ fontSize: "30px" }} />
          </SMButton>
          <SMButton>
            <Box
              component="img"
              sx={{
                width: "30px",
                m: 0,
                p: 0,
              }}
              alt="NSBS"
              src="pinkbike.png"
            />
          </SMButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Closer;
