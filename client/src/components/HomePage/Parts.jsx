import { Box, ImageList, ImageListItem, Stack, Typography } from "@mui/material";

const BRAND_GREEN = "#243d33";

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
    <Box
      component="section"
      aria-label="Parts and accessories"
      sx={{ bgcolor: "#fff" }}
    >
      <Box
        component="img"
        src="bikes-min.jpg"
        alt="Bikes and parts at North Shore Bike Shop"
        sx={{
          width: "100%",
          display: "block",
          height: {
            xs: "min(62vw, 440px)",
            sm: "min(56vw, 500px)",
            md: "min(48vw, 560px)",
          },
          minHeight: { xs: 280, sm: 300, md: 340 },
          objectFit: "cover",
          objectPosition: "center",
        }}
        loading="lazy"
        decoding="async"
      />
      <Box
        sx={{
          maxWidth: 1680,
          mx: "auto",
          px: { xs: 1.5, sm: 2, md: 2.5 },
          pt: { xs: 2.5, md: 3 },
          pb: { xs: 2, md: 2.5 },
        }}
      >
        <Stack
          spacing={1.5}
          alignItems="center"
          sx={{ mb: { xs: 1.5, md: 2 } }}
        >
          <Typography
            component="h2"
            sx={{
              m: 0,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: { xs: "0.06em", sm: "0.08em" },
              fontSize: { xs: "1.3rem", sm: "1.45rem", md: "1.6rem" },
              color: BRAND_GREEN,
              lineHeight: 1.15,
              textAlign: "center",
            }}
          >
            Parts &amp; accessories
          </Typography>
        </Stack>
        <Typography
          sx={{
            m: 0,
            mb: { xs: 2.5, md: 3 },
            maxWidth: 720,
            mx: "auto",
            textAlign: "center",
            fontSize: { xs: "1rem", md: "1.0625rem" },
            lineHeight: 1.65,
            color: "rgba(0,0,0,0.78)",
            fontWeight: 400,
          }}
        >
          At North Shore Bike Shop, we pride ourselves on being well stocked with
          all the parts you may need. Whether you&apos;re looking for affordable
          options to get your bike up and running or the latest cutting-edge
          technology, NSBS has you covered.
        </Typography>

        <Box>
          <ImageList
            gap={0}
            sx={{
              width: "100%",
              maxWidth: 1100,
              mx: "auto",
              mb: 0,
              // ImageList sets columns inline from `cols`; override per breakpoint here.
              gridTemplateColumns: {
                xs: "repeat(3, 1fr) !important",
                sm: "repeat(4, 1fr) !important",
                md: "repeat(6, 1fr) !important",
              },
              gap: { xs: "12px 16px !important", md: "28px !important" },
            }}
          >
            {logoNames.map((item) => (
              <ImageListItem
                key={item}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "& img": {
                    filter: "grayscale(1)",
                    opacity: 0.88,
                    transition: "filter 0.25s ease, opacity 0.25s ease",
                  },
                  "&:hover img": {
                    filter: "grayscale(0)",
                    opacity: 1,
                  },
                }}
              >
                <Box
                  component="img"
                  src={`logos2/${item}`}
                  alt=""
                  loading="lazy"
                  sx={{
                    width: "100%",
                    height: { xs: 56, sm: 68, md: 88, lg: 96 },
                    maxHeight: 96,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </Box>
    </Box>
  );
};

export default Parts;
