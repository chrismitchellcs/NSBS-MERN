import { Box, Button, Grid, Stack, styled } from "@mui/material";

const ZigZagButton = styled(Button)({
  backgroundColor: "white",
  color: "black",
  width: "25%",
  maxHeight: "40px",

  // margin: "20px",

  "&:hover": {
    // textDecoration: "underline",
    // textDecorationThickness: "2px",
    // textUnderlineOffset: "5px",
    backgroundColor: "white",
    // color: "black",
  },
});

const ZigZag = ({ name, description, link, image, order }) => {
  return (
    <Box
      // display="flex"
      justifyContent="center"
      // alignItems="center"
      sx={{
        // backgroundColor: "black",
        width: "100%",
        // height: "30vh",
        // mt: -,
        m: 0,
        p: 0,
      }}
    >
      <Grid container direction={order ? "row" : "row-reverse"} spacing={0}>
        <Grid item sm={6} xs={12}>
          <Box
            component="img"
            display={"flex"}
            sx={{
              width: "100%",
              m: 0,
              p: 0,
            }}
            alt="NSBS"
            src={image}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems={"center"}
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "black",
              color: "white",
            }}
          >
            <Stack
              width={"75%"}
              spacing={3}
              alignContent={"flex-start"}
              justifyContent={"space-between"}
            >
              <Box sx={{ fontSize: "20px", fontWeight: "400" }}>{name}</Box>
              <Box sx={{ fontSize: "16px", fontWeight: "400" }}>
                {description}
              </Box>
              <ZigZagButton>More Info</ZigZagButton>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ZigZag;
