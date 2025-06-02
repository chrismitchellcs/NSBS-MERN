import { Box, ImageList, ImageListItem } from "@mui/material";

const logoNames = [
  "sram.jpg",
  "shimano.jpg",
  "fox.jpg",
  "rockshox.jpg",
  "camelbak.jpg",
  "cush.jpg",
  "endura.jpg",
  "evoc.jpg",
  "giro.jpg",
  "ixs.jpg",
  "maxxis.jpg",
  "oneup.jpg",
  "rc.jpg",
  "stans.jpg",
  "tairin.jpg",
  "tld.jpg",
  "wr1.jpg",
  "bell.jpg",
];

const Parts = () => {
  return (
    <Box textAlign={"center"} pb={2}>
      <Box
        component={"img"}
        src="bikes-min.jpg"
        width={"100%"}
        height={"56vw"}
      ></Box>
      <Box
        pt={1}
        sx={{
          fontSize: "26px",
          fontWeight: "600",
          color: "black",
          m: 2,
        }}
      >
        Parts & Accessories
      </Box>
      <Box
        sx={{
          fontSize: { xs: "16px", sm: "18px" },
          fontWeight: "400",
          color: "black",
          width: "60%",
          m: 2,
          ml: "20%",
          lineHeight: "1.5",
        }}
        textAlign={"center"}
      >
        At North Shore Bike Shop, we pride ourselves on being well stocked with
        all the parts you may need. Whether you're looking for affordable
        options to get your bike up and running or the latest cutting-edge
        technology, NSBS has you covered.
      </Box>
      <Box
        justifyContent={"center"}
        m={5}
        sx={{ display: { xs: "none", sm: "none", md: "block" } }}
      >
        <ImageList sx={{ width: "60%", ml: "20%" }} cols={6} gap={40}>
          {logoNames.map((item) => (
            <ImageListItem key={item}>
              <img
                src={`logos2/${item}`}
                alt={item}
                loading="lazy"
                width={"100px"}
                style={{ filter: "grayscale(100%)" }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Box>
  );
};

export default Parts;
