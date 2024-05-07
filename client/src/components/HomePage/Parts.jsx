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
    <Box textAlign={"center"}>
      <Box component={"img"} src="nsbsparts.jpg" width={"100%"}></Box>
      <Box
        sx={{
          fontSize: { xs: "26px", sm: "30px" },
          color: "black",
          m: 2,
          fontWeight: "400",
        }}
      >
        PARTS & ACCESSORIES
      </Box>
      <Box
        sx={{
          fontSize: { xs: "18px", sm: "24px" },
          fontWeight: "300",
          color: "black",
          width: "60%",
          m: 2,
          ml: "20%",
        }}
        textAlign={"center"}
      >
        North Shore Bike Shop is always well stocked with any parts you may
        need. Whether you want to get your bike up and running affordably, or
        you want the latest and greatest tech, NSBS has it.
      </Box>
      <Box
        justifyContent={"center"}
        m={5}
        sx={{ display: { xs: "none", sm: "none", md: "block" } }}
      >
        <ImageList sx={{ width: "80%", ml: "10%" }} cols={6} gap={40}>
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
