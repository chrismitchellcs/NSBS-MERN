import { Box, Button, Stack, styled } from "@mui/material";
import { useState } from "react";
import { Image, Transformation } from "cloudinary-react";

const allSizes = [
  '10"',
  '12"',
  '14"',
  '16"',
  '20"',
  '24"',
  "Short",
  "Long",
  "X-Long",
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "1",
  "2",
  "3",
  "4",
  "5",
];

const availabilityMap = {
  "In Stock": "Available",
  "Pre-Order": "Contact Us",
  "Out of Stock": "Out of Stock",
  "Low Stock (1)": "Contact Us",
  "Low Stock (2)": "Contact Us",
  "Low Stock (3)": "Contact Us",
  "Low Stock (4)": "Contact Us",
  "Low Stock (5)": "Contact Us",
  "Available to Order": "Available to Order",
  "In Store": "In Store",
};

const SeeMoreButton = styled(Button)({
  color: "black",
  border: "solid",
  borderWidth: "1px",
  maxHeight: "40px",
  fontWeight: "400",
  fontSize: "14px",

  "&:hover": {
    backgroundColor: "white",
    color: "black",
  },
});

const BikeLandingPage = ({ bike }) => {
  const images = JSON.parse(bike.colors);
  const [currentImage, setCurrentImage] = useState(Object.values(images)[0]);
  const sortedModels = JSON.parse(bike.models).sort((a, b) => {
    const sizeDiff = allSizes.indexOf(a.size) - allSizes.indexOf(b.size);
    if (sizeDiff !== 0) return sizeDiff;
    return a.color.localeCompare(b.color);
  });

  console.log(sortedModels);

  return (
    <Stack pl={{ xs: 1, md: 10 }} pr={{ xs: 1, md: 10 }} pb={5} spacing={5}>
      <Stack
        direction={{ xs: "column", sm: "column", md: "row" }}
        alignItems={{ xs: "center", md: "flex-start" }}
      >
        <Stack alignItems={"center"} pt={2}>
          <Image
            cloudName="ds4ukwnxl"
            publicId={currentImage}
            alt="bike"
            style={{
              width: "100%",
              maxWidth: "800px",
              height: "auto",
            }}
          >
            <Transformation crop="pad" />
          </Image>
          <Stack direction={"row"} spacing={1}>
            {Object.entries(images).map(([key, value]) => (
              <Button
                sx={{
                  m: 0,
                  p: 0.5,
                  borderRadius: 2,
                  transition: "background-color 0.5s ease",
                  textTransform: "none",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "#c0c0c0",
                    color: "black",
                    "& img": {
                      filter: " brightness(0.75)  contrast(1); ", // makes a white image appear dark
                    },
                  },
                  "& img": {
                    transition: "filter 0.5s ease", // <-- image filter transition
                  },
                }}
                onClick={() => setCurrentImage(value)}
              >
                <Stack alignItems={"center"}>
                  <Image
                    cloudName="ds4ukwnxl"
                    publicId={value}
                    width="100"
                    crop="pad"
                  ></Image>
                  <Box fontSize={"12px"} fontWeight={"300"}>
                    {key}
                  </Box>
                </Stack>
              </Button>
            ))}
          </Stack>
        </Stack>

        <Stack p={{ xs: 1, md: 5 }} spacing={2}>
          <Box fontSize={"28px"} fontWeight={"700"}>
            {bike.brand} {bike.name}
          </Box>

          <Stack direction={"row"} spacing={1}>
            {" "}
            <Box fontSize={"24px"} fontWeight={"400"}>
              ${bike.price}
            </Box>{" "}
            <Box fontSize={"24px"} fontWeight={"300"}>
              CAD
            </Box>
          </Stack>
          <Stack spacing={1}>
            <Box>Select Size / Colour:</Box>
            <Stack spacing={1}>
              {sortedModels.map((model) => (
                <Button
                  sx={{
                    m: 0,
                    p: 0,
                    border: 1,
                    transition: "background-color 0.5s ease",
                    textTransform: "none",
                    color: "black",

                    "&:hover": {
                      backgroundColor: "#c0c0c0",
                      color: "black",
                      "& img": {
                        filter: " brightness(0.75) saturate(0) contrast(1); ", // makes a white image appear dark
                      },
                    },
                    "& img": {
                      transition: "filter 0.5s ease", // <-- image filter transition
                    },
                  }}
                  onClick={() => setCurrentImage(images[model.color])}
                >
                  <Stack
                    direction={"row"}
                    p={0.5}
                    pl={1}
                    pr={2}
                    justifyContent={"space-between"}
                    width={{ xs: "350px", md: "400px" }}
                    flex={1}
                    alignItems={"center"}
                  >
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                      <Image
                        cloudName="ds4ukwnxl"
                        publicId={images[model.color]}
                        width="75"
                        crop="pad"
                      ></Image>
                      <Box fontSize={"12px"} fontWeight={"300"}>
                        {model.color}
                      </Box>
                      <Box fontSize={"12px"} fontWeight={"600"}>
                        {model.size}
                      </Box>
                    </Stack>

                    <Box fontSize={"12px"} fontWeight={"300"}>
                      {availabilityMap[model.availability]}
                    </Box>
                  </Stack>
                </Button>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack display={{ xs: "block", sm: "block", md: "block" }} spacing={3}>
        <Box
          sx={{
            fontSize: "26px",
            fontWeight: "700",
          }}
        >
          ABOUT
        </Box>
        <Box sx={{ whiteSpace: "pre-wrap" }}>{bike.description}</Box>
        <Box justifySelf={{ xs: "center", md: "flex-start" }}>
          <SeeMoreButton
            // @ts-ignore
            target="_blank"
            href={bike.link}
          >
            See More
          </SeeMoreButton>
        </Box>
      </Stack>
      <Stack spacing={4}>
        <Box
          alignSelf={"center"}
          sx={{
            fontSize: "26px",
            fontWeight: "700",
          }}
        >
          WHY BUY FROM NSBS
        </Box>
        <Stack
          direction={{ xs: "column", sm: "column", md: "row" }}
          alignSelf={"center"}
          width={"100%"}
          justifyContent={"space-around"}
          spacing={5}
          alignItems={{ xs: "center", sm: "center", md: "inherit" }}
        >
          <Stack width={{ xs: "80%", sm: "80%", md: "25%" }} spacing={1}>
            <Box
              textAlign={"center"}
              sx={{ fontSize: "20px", fontWeight: "700" }}
            >
              Lifetime Free Tune-Ups
            </Box>
            <Box textAlign={"center"}>
              FREE drivetrain and brake adjustments, wheel truing, and
              additional maintenance whenever you need! Only applies to original
              owner.
            </Box>
          </Stack>
          <Stack width={{ xs: "80%", sm: "80%", md: "25%" }} spacing={1}>
            <Box
              textAlign={"center"}
              sx={{ fontSize: "20px", fontWeight: "700" }}
            >
              15% Off All Parts and Labour
            </Box>
            <Box textAlign={"center"}>
              FREE drivetrain and brake adjustments, wheel truing, and
              additional maintenance whenever you need! Only applies to original
              owner.
            </Box>
          </Stack>
          <Stack width={{ xs: "80%", sm: "80%", md: "25%" }} spacing={1}>
            <Box
              textAlign={"center"}
              sx={{ fontSize: "20px", fontWeight: "700" }}
            >
              Custom Bike Setup
            </Box>
            <Box textAlign={"center"}>
              Professional assistance with custom accessories, fitting, and
              suspension setup
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default BikeLandingPage;
