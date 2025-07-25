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
  "Pre-Order": "Pre-Order",
  "Out of Stock": "Out of Stock",
  "Out Of Stock": "Out of Stock",
  "Low Stock (1)": "Low Stock",
  "Low Stock (2)": "Low Stock",
  "Low Stock (3)": "Low Stock",
  "Low Stock (4)": "Low Stock",
  "Low Stock (5)": "Low Stock",
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

function extractPublicId(cloudinaryUrl) {
  try {
    const parts = cloudinaryUrl.split("/upload/");
    if (parts.length < 2) return null;

    // Remove version string if it exists (e.g., v1748840541/)
    const path = parts[1].replace(/^v\d+\//, "");
    return decodeURIComponent(path); // handle special characters like é
  } catch {
    return null;
  }
}

const BikeLandingPage = ({ bike }) => {
  const images = JSON.parse(bike.colors);
  const [currentImage, setCurrentImage] = useState(Object.values(images)[0]);
  const models = JSON.parse(bike.models);
  let storeModels = [];
  try {
    storeModels = JSON.parse(bike.inStock);
  } catch {}
  const allModels = [...models, ...storeModels];
  const sortedModels = allModels.sort((a, b) => {
    const sizeDiff = allSizes.indexOf(a.size) - allSizes.indexOf(b.size);
    if (sizeDiff !== 0) return sizeDiff;
    return a.color.localeCompare(b.color);
  });

  return (
    <Stack pl={{ xs: 1, md: 10 }} pr={{ xs: 1, md: 10 }} pb={5} spacing={5}>
      <Stack
        direction={{ xs: "column", sm: "column", md: "column", lg: "row" }}
        alignItems={{ xs: "center", lg: "flex-start" }}
        spacing={{ xs: 0, lg: 5, xl: 10 }}
        justifyContent={"center"}
      >
        <Stack alignItems={"center"} pt={2}>
          <Image
            cloudName="ds4ukwnxl"
            publicId={extractPublicId(currentImage)}
            width="1000" // double width for retina sharpness
            crop="pad"
            quality="100" // max quality
            fetchFormat="auto" // modern format support
            alt={`bike`}
            style={{
              width: "100%",
              display: "block",
              objectFit: "contain",
            }}
          />

          <Stack direction={"row"} spacing={1}>
            {Object.entries(images).map(([key, value]) => {
              if (value !== "") {
                return (
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
                        publicId={extractPublicId(value)}
                        width="150" // double width for retina sharpness
                        crop="pad"
                        quality="100" // max quality
                        fetchFormat="auto" // modern format support
                        alt={`bike`}
                        style={{
                          width: "100px",
                          display: "block",
                          objectFit: "contain",
                        }}
                      />
                      <Box fontSize={"12px"} fontWeight={"300"}>
                        {key}
                      </Box>
                    </Stack>
                  </Button>
                );
              }
            })}
          </Stack>
        </Stack>

        <Stack p={{ xs: 1, md: 5 }} spacing={2}>
          <Box fontSize={"28px"} fontWeight={"700"}>
            {bike.brand} {bike.name}
          </Box>

          <Stack direction={"row"} spacing={1}>
            {" "}
            {bike.saleprice === 0 || bike.saleprice === null ? (
              <Box fontSize={"24px"} fontWeight={"400"}>
                ${bike.price.toLocaleString()}
              </Box>
            ) : (
              <Box
                display={"flex"}
                justifyContent={{
                  xs: "center",
                  sm: "center",
                  md: "flex-start",
                }}
              >
                <Box
                  color={"black"}
                  fontSize={"24px"}
                  fontWeight={"300"}
                  sx={{ textDecoration: "line-through", mr: 1 }}
                >
                  ${bike.price.toLocaleString()}
                </Box>
                <Box color={"black"} fontSize={"24px"} fontWeight={"400"}>
                  ${bike.saleprice.toLocaleString()}
                </Box>
              </Box>
            )}
            <Box fontSize={"24px"} fontWeight={"300"}>
              CAD
            </Box>
          </Stack>
          <Stack spacing={1}>
            <Box>Select Size / Colour:</Box>
            <Stack spacing={1}>
              {sortedModels.map((model) => {
                if (model.availability !== "Out of Stock") {
                  return (
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
                            filter:
                              " brightness(0.75) saturate(0) contrast(1); ", // makes a white image appear dark
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
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          spacing={1}
                        >
                          <Image
                            cloudName="ds4ukwnxl"
                            publicId={extractPublicId(images[model.color])}
                            width="150" // double width for retina sharpness
                            crop="pad"
                            quality="100" // max quality
                            fetchFormat="auto" // modern format support
                            alt={`${model.color} bike`}
                            style={{
                              width: "75px",
                              display: "block",
                              objectFit: "contain",
                            }}
                          />
                          <Box fontSize={"12px"} fontWeight={"300"}>
                            {model.color}
                          </Box>
                          <Box fontSize={"12px"} fontWeight={"600"}>
                            {model.size}
                          </Box>
                        </Stack>
                        {/* <Availability model={model}></Availability> */}
                        <Box fontSize={"12px"} fontWeight={"300"}>
                          {availabilityMap[model.availability]}
                        </Box>
                      </Stack>
                    </Button>
                  );
                }
              })}
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
