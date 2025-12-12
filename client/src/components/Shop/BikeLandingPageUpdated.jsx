import { Box, Button, Stack, styled } from "@mui/material";
import { useState } from "react";
import { Image } from "cloudinary-react";
import { useNavigate } from "react-router-dom";

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

    const path = parts[1].replace(/^v\d+\//, "");
    return decodeURIComponent(path); // handle special characters like é
  } catch {
    return null;
  }
}

const BikeLandingPageUpdated = ({ bike }) => {
  const navigate = useNavigate();
  const images = JSON.parse(bike.colors);
  const [currentImage, setCurrentImage] = useState(Object.values(images)[0]);
  const [selectedModel, setSelectedModel] = useState(null);
  const models = JSON.parse(bike.models);
  let storeModels = [];
  try {
    storeModels = JSON.parse(bike.inStock);
  } catch {}
  const allModels = [...models, ...storeModels];
  // Remove duplicates based on color and size combination, prioritizing 'In Store' availability
  const uniqueModelsMap = new Map();
  allModels.forEach((model) => {
    const key = `${model.color}-${model.size}`;
    const existing = uniqueModelsMap.get(key);

    if (!existing) {
      uniqueModelsMap.set(key, model);
    } else if (
      model.availability === "In Store" &&
      existing.availability !== "In Store"
    ) {
      uniqueModelsMap.set(key, model);
    }
  });
  const uniqueModels = Array.from(uniqueModelsMap.values());
  const sortedModels = uniqueModels.sort((a, b) => {
    const sizeDiff = allSizes.indexOf(a.size) - allSizes.indexOf(b.size);
    if (sizeDiff !== 0) return sizeDiff;
    return a.color.localeCompare(b.color);
  });

  return (
    <div className="w-full flex md:flex-row flex-col">
      <div className="md:w-[55%] lg:w-[65%] w-full mt-6">
        <Image
          cloudName="ds4ukwnxl"
          publicId={extractPublicId(currentImage)}
          width="1000" // double width for retina sharpness
          crop="pad"
          quality="100" // max quality
          fetchFormat="auto" // modern format support
          alt={`bike`}
          style={{
            width: "90%",
            display: "block",
            margin: "0 auto",
            objectFit: "contain",
          }}
        />
        <div className="md:ml-8 px-4 md:px-0 b-8">
          <div className="text-lg text-gray-900 font-semibold mb-2">
            Colours:
          </div>
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
                          filter: " brightness(0.75)  contrast(1); ",
                        },
                      },
                      "& img": {
                        transition: "filter 0.5s ease",
                      },
                    }}
                    onClick={() => setCurrentImage(value)}
                  >
                    <Stack alignItems={"center"}>
                      <Image
                        cloudName="ds4ukwnxl"
                        publicId={extractPublicId(value)}
                        width="150"
                        crop="pad"
                        quality="100"
                        fetchFormat="auto"
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
              return null;
            })}
          </Stack>
        </div>
        <div className="mx-8 mb-8 md:block hidden">
          <div className="text-lg text-gray-900 font-semibold mb-2">About:</div>
          <div className="text-gray-900 text-lg font-light">
            {bike.description}
          </div>
          <div className="mt-4">
            <SeeMoreButton
              // @ts-ignore
              target="_blank"
              href={bike.link}
            >
              See More
            </SeeMoreButton>
          </div>
        </div>
        <div className="mt-16 mb-16 mx-8 md:block hidden">
          <h2 className="text-3xl md:text-2xl font-bold text-center text-gray-900 mb-12">
            Why Buy From NSBS?
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-100 ">
              <h3 className="text-xl md:text-xl font-bold text-gray-900 mb-4">
                Lifetime Free Tune-Ups
              </h3>
              <p className="text-gray-700 leading-relaxed max-w-sm">
                FREE drivetrain and brake adjustments, wheel truing, and
                additional maintenance whenever you need! Only applies to
                original owner.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-100 ">
              <h3 className="text-xl md:text-xl font-bold text-gray-900 mb-4">
                15% Off All Parts and Labour
              </h3>
              <p className="text-gray-700 leading-relaxed max-w-sm">
                Save on all parts and labor for your bike. This exclusive
                discount applies to all NSBS customers on every purchase.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-100 ">
              <h3 className="text-xl md:text-xl font-bold text-gray-900 mb-4">
                Custom Bike Setup
              </h3>
              <p className="text-gray-700 leading-relaxed max-w-sm">
                Professional assistance with custom accessories, fitting, and
                suspension setup tailored to your riding style.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="md:w-[45%] lg:w-[35%] w-full sticky top-[80px] md:h-[calc(100vh-80px)] flex flex-col [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden overflow-hidden justify-center items-center"
      >
        <div className="flex-1 overflow-y-auto py-6 md:pr-6 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="text-2xl font-semibold text-gray-900 mb-2">
            {bike.brand} {bike.name}
          </div>
          <div className="mb-4">
            {bike.saleprice === 0 || bike.saleprice === null ? (
              <div className="text-2xl text-gray-900 font-light">
                ${bike.price.toLocaleString()}
              </div>
            ) : (
              <div className="flex">
                <div className="text-2xl text-gray-900 line-through mr-1 font-light">
                  ${bike.price.toLocaleString()}
                </div>
                <div className="text-2xl text-gray-900 font-light">
                  ${bike.saleprice.toLocaleString()}
                </div>
                <div className="text-2xl font-light text-gray-900"> </div>
                <div className="text-2xl font-light text-gray-900 ml-1">
                  CAD
                </div>
              </div>
            )}
          </div>
          <div className="mb-2">
            <div className="text-lg text-gray-900 mb-2">
              Select Size / Colour:
            </div>
            <Stack
              spacing={1}
              minWidth={{ xs: "320px", sm: "320px", md: "340px", lg: "400px" }}
            >
              {sortedModels.map((model) => {
                if (model.availability !== "Out of Stock") {
                  const isSelected =
                    selectedModel &&
                    selectedModel.color === model.color &&
                    selectedModel.size === model.size;
                  return (
                    <Button
                      key={`${model.color}-${model.size}`}
                      sx={{
                        m: 0,
                        p: 0,
                        border: 1,
                        borderColor: isSelected ? "black" : "gray",
                        borderWidth: isSelected ? "2px" : "1px",
                        transition: "background-color 0.5s ease",
                        textTransform: "none",
                        color: "black",
                        backgroundColor: isSelected ? "#f0f0f0" : "white",
                        "&:hover": {
                          backgroundColor: "#c0c0c0",
                          color: "black",
                          "& img": {
                            filter:
                              " brightness(0.75) saturate(0) contrast(1); ",
                          },
                        },
                        "& img": {
                          transition: "filter 0.5s ease",
                        },
                      }}
                      onClick={() => {
                        setCurrentImage(images[model.color]);
                        setSelectedModel(model);
                      }}
                    >
                      <Stack
                        direction={"row"}
                        p={0.5}
                        pl={1}
                        pr={2}
                        justifyContent={"space-between"}
                        // width={{ xs: "350px", md: "400px" }}
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
                            width="150"
                            crop="pad"
                            quality="100"
                            fetchFormat="auto"
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
                        <Box fontSize={"12px"} fontWeight={"300"}>
                          {availabilityMap[model.availability]}
                        </Box>
                      </Stack>
                    </Button>
                  );
                }
                return null;
              })}
            </Stack>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 pb-6 md:pr-6 w-full px-2">
          {/* {selectedModel ? (
            <button
              className="w-full bg-black text-white py-4 px-6 rounded-lg font-light text-lg hover:bg-gray-800 transition-colors duration-200"
              onClick={() => {
                // Handle buy now action
                console.log("Buy Now:", selectedModel);
                // Add your buy now logic here
              }}
            >
              Buy Now
            </button>
          ) : (
            <button
              className="w-full bg-gray-300 text-gray-600 py-4 px-6 rounded-lg font-light text-lg cursor-not-allowed"
              disabled
            >
              Select an option
            </button>
          )} */}
          {!selectedModel ? (
            <button
              className="w-full bg-gray-300 text-gray-600 py-4 px-6 rounded-lg font-light text-lg cursor-not-allowed"
              disabled
            >
              Select an option
            </button>
          ) : selectedModel.availability === "Out Of Stock" ? (
            <button className="w-full bg-black text-white py-4 px-6 rounded-lg font-light text-lg hover:bg-gray-800 transition-colors duration-200">
              Out of Stock - Contact Us
            </button>
          ) : (
            <button
              className="w-full bg-black text-white py-4 md:px-6 rounded-lg font-light text-lg hover:bg-gray-800 transition-colors duration-200"
              onClick={() => {
                console.log("Buy Now:", selectedModel);
                navigate(
                  `/checkout?bikeid=${bike._id}&color=${
                    selectedModel.color
                  }&size=${selectedModel.size}&image=${encodeURIComponent(
                    extractPublicId(images[selectedModel.color])
                  )}&availability=${selectedModel.availability}`
                );
              }}
            >
              Buy Now / Contact Us
            </button>
          )}
          {selectedModel && (
            <div className="mt-2 text-sm text-gray-600 text-center">
              {bike.brand} {bike.name} • {selectedModel.color} •{" "}
              {selectedModel.size}
            </div>
          )}
        </div>
        <div className="mx-8 md:mb-8 md:hidden block">
          <div className="text-lg text-gray-900 font-semibold mb-2">About:</div>
          <div className="text-gray-900 text-lg font-light">
            {bike.description}
          </div>
          <div className="mt-4">
            <SeeMoreButton
              // @ts-ignore
              target="_blank"
              href={bike.link}
            >
              See More
            </SeeMoreButton>
          </div>
        </div>

        <div className="mt-16 mb-16 mx-8 md:hidden block">
          <h2 className="text-3xl md:text-2xl font-bold text-center text-gray-900 mb-12">
            Why Buy From NSBS?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-100 ">
              <h3 className="text-xl md:text-xl font-bold text-gray-900 mb-4">
                Lifetime Free Tune-Ups
              </h3>
              <p className="text-gray-700 leading-relaxed max-w-sm">
                FREE drivetrain and brake adjustments, wheel truing, and
                additional maintenance whenever you need! Only applies to
                original owner.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-100 ">
              <h3 className="text-xl md:text-xl font-bold text-gray-900 mb-4">
                15% Off All Parts and Labour
              </h3>
              <p className="text-gray-700 leading-relaxed max-w-sm">
                Save on all parts and labor for your bike. This exclusive
                discount applies to all NSBS customers on every purchase.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-100 ">
              <h3 className="text-xl md:text-xl font-bold text-gray-900 mb-4">
                Custom Bike Setup
              </h3>
              <p className="text-gray-700 leading-relaxed max-w-sm">
                Professional assistance with custom accessories, fitting, and
                suspension setup tailored to your riding style.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeLandingPageUpdated;
