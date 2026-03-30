import { Box, Button, Stack, styled } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Image } from "cloudinary-react";
import { useNavigate } from "react-router-dom";

const CLOUD_NAME =
  process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "ds4ukwnxl";

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

function normalizeAvailabilityKey(av) {
  if (av == null) return "";
  return String(av).trim().toLowerCase().replace(/\s+/g, " ");
}

function isOutOfStock(av) {
  return normalizeAvailabilityKey(av) === "out of stock";
}

function availabilityLabel(av) {
  if (av == null) return "";
  const n = normalizeAvailabilityKey(av);
  const hit = Object.entries(availabilityMap).find(
    ([k]) => normalizeAvailabilityKey(k) === n
  );
  return hit ? hit[1] : String(av);
}

function parseBikeColors(raw) {
  if (raw == null) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) return raw;
  if (typeof raw !== "string") return {};
  try {
    const o = JSON.parse(raw);
    return o && typeof o === "object" && !Array.isArray(o) ? o : {};
  } catch {
    return {};
  }
}

function parseBikeModelsArray(raw) {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== "string") return [];
  try {
    const a = JSON.parse(raw);
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}

const SeeMoreLink = styled("a")({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  minHeight: "36px",
  padding: "6px 16px",
  color: "black",
  border: "solid",
  borderWidth: "1px",
  maxHeight: "40px",
  fontWeight: "400",
  fontSize: "14px",
  fontFamily: "inherit",
  textDecoration: "none",
  cursor: "pointer",
  borderRadius: 1,

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
    return decodeURIComponent(path);
  } catch {
    return null;
  }
}

function firstColorImage(images) {
  const vals = Object.values(images).filter((v) => v && v !== "");
  return vals[0] || "";
}

/** Shared marketing grid — one source of copy; placement still differs by breakpoint via wrapper classes. */
function WhyBuyNsbsGrid({ className }) {
  return (
    <div className={className}>
      <h2 className="text-3xl md:text-2xl font-bold text-center text-gray-900 mb-12">
        Why Buy From NSBS?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-100 ">
          <h3 className="text-xl md:text-xl font-bold text-gray-900 mb-4">
            Lifetime Free Tune-Ups
          </h3>
          <p className="text-gray-700 leading-relaxed max-w-sm">
            FREE drivetrain and brake adjustments, wheel truing, and additional
            maintenance whenever you need! Only applies to original owner.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-100 ">
          <h3 className="text-xl md:text-xl font-bold text-gray-900 mb-4">
            15% Off All Parts and Labour
          </h3>
          <p className="text-gray-700 leading-relaxed max-w-sm">
            Save on all parts and labor for your bike. This exclusive discount
            applies to all NSBS customers on every purchase.
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
  );
}

function AboutSection({ bike }) {
  return (
    <>
      <div className="text-lg text-gray-900 font-semibold mb-2">About:</div>
      <div className="text-gray-900 text-lg font-light">{bike.description}</div>
      {bike.link ? (
        <div className="mt-4">
          <SeeMoreLink
            target="_blank"
            rel="noopener noreferrer"
            href={bike.link}
          >
            See More
          </SeeMoreLink>
        </div>
      ) : null}
    </>
  );
}

const BikeLandingPageUpdated = ({ bike }) => {
  const navigate = useNavigate();
  const images = useMemo(() => parseBikeColors(bike?.colors), [bike?.colors]);
  const [currentImage, setCurrentImage] = useState(() =>
    firstColorImage(images)
  );
  const [selectedModel, setSelectedModel] = useState(null);

  const bikeTitle = [bike?.brand, bike?.name].filter(Boolean).join(" ").trim();

  useEffect(() => {
    const next = parseBikeColors(bike?.colors);
    setCurrentImage(firstColorImage(next));
    setSelectedModel(null);
  }, [bike?._id, bike?.colors]);

  const models = useMemo(() => parseBikeModelsArray(bike?.models), [
    bike?.models,
  ]);
  const storeModels = useMemo(() => parseBikeModelsArray(bike?.inStock), [
    bike?.inStock,
  ]);

  const sortedModels = useMemo(() => {
    const allModels = [...models, ...storeModels];
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
    return [...uniqueModels].sort((a, b) => {
      const sizeDiff = allSizes.indexOf(a.size) - allSizes.indexOf(b.size);
      if (sizeDiff !== 0) return sizeDiff;
      return a.color.localeCompare(b.color);
    });
  }, [models, storeModels]);

  const mainPublicId = extractPublicId(currentImage);
  const mainAlt = bikeTitle
    ? `${bikeTitle} — product image`
    : "Bicycle product image";

  return (
    <div className="w-full flex md:flex-row flex-col">
      <div className="md:w-[55%] lg:w-[65%] w-full mt-6">
        {mainPublicId ? (
          <Image
            key={`${bike._id}-${mainPublicId}`}
            cloudName={CLOUD_NAME}
            publicId={mainPublicId}
            width="1000"
            crop="pad"
            quality="100"
            fetchFormat="auto"
            alt={mainAlt}
            style={{
              width: "90%",
              display: "block",
              margin: "0 auto",
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            className="w-[90%] mx-auto min-h-[200px] flex items-center justify-center bg-gray-100 text-gray-500 text-sm rounded"
            role="img"
            aria-label={mainAlt}
          >
            No image available
          </div>
        )}
        <div className="md:ml-8 px-4 md:px-0 b-8">
          <div className="text-lg text-gray-900 font-semibold mb-2">
            Colours:
          </div>
          <Stack direction={"row"} spacing={1} useFlexGap flexWrap="wrap">
            {Object.entries(images).map(([colorKey, value]) => {
              if (value !== "") {
                const thumbPid = extractPublicId(value);
                const thumbAlt = bikeTitle
                  ? `${bikeTitle} — ${colorKey}`
                  : `${colorKey} colour`;
                return (
                  <Button
                    key={colorKey}
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
                      {thumbPid ? (
                        <Image
                          cloudName={CLOUD_NAME}
                          publicId={thumbPid}
                          width="150"
                          crop="pad"
                          quality="100"
                          fetchFormat="auto"
                          alt={thumbAlt}
                          style={{
                            width: "100px",
                            display: "block",
                            objectFit: "contain",
                          }}
                        />
                      ) : null}
                      <Box fontSize={"12px"} fontWeight={"300"}>
                        {colorKey}
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
          <AboutSection bike={bike} />
        </div>
        <WhyBuyNsbsGrid className="mt-16 mb-16 mx-8 md:block hidden" />
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
              <div className="flex flex-wrap items-baseline gap-x-2 text-2xl text-gray-900 font-light">
                <span>${bike.price.toLocaleString()}</span>
                <span className="text-2xl font-light">CAD</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-baseline gap-x-2">
                <div className="text-2xl text-gray-900 line-through font-light">
                  ${bike.price.toLocaleString()}
                </div>
                <div className="text-2xl text-gray-900 font-light">
                  ${bike.saleprice.toLocaleString()}
                </div>
                <div className="text-2xl font-light text-gray-900">CAD</div>
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
                const oos = isOutOfStock(model.availability);
                const isSelected =
                  selectedModel &&
                  selectedModel.color === model.color &&
                  selectedModel.size === model.size;
                const rowImg = images[model.color];
                const rowPid = rowImg ? extractPublicId(rowImg) : null;
                const rowAlt = bikeTitle
                  ? `${bikeTitle} — ${model.color} ${model.size}`
                  : `${model.color} ${model.size}`;
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
                      color: oos ? "rgba(0,0,0,0.45)" : "black",
                      backgroundColor: isSelected ? "#f0f0f0" : "white",
                      opacity: oos ? 0.85 : 1,
                      "&:hover": {
                        backgroundColor: "#c0c0c0",
                        color: oos ? "rgba(0,0,0,0.45)" : "black",
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
                      if (rowImg) setCurrentImage(rowImg);
                      setSelectedModel(model);
                    }}
                  >
                    <Stack
                      direction={"row"}
                      p={0.5}
                      pl={1}
                      pr={2}
                      justifyContent={"space-between"}
                      flex={1}
                      alignItems={"center"}
                    >
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        spacing={1}
                      >
                        {rowPid ? (
                          <Image
                            cloudName={CLOUD_NAME}
                            publicId={rowPid}
                            width="150"
                            crop="pad"
                            quality="100"
                            fetchFormat="auto"
                            alt={rowAlt}
                            style={{
                              width: "75px",
                              display: "block",
                              objectFit: "contain",
                            }}
                          />
                        ) : null}
                        <Box fontSize={"12px"} fontWeight={"300"}>
                          {model.color}
                        </Box>
                        <Box fontSize={"12px"} fontWeight={"600"}>
                          {model.size}
                        </Box>
                      </Stack>
                      <Box fontSize={"12px"} fontWeight={"300"}>
                        {availabilityLabel(model.availability)}
                      </Box>
                    </Stack>
                  </Button>
                );
              })}
            </Stack>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 pb-6 md:pr-6 w-full px-2">
          {!selectedModel ? (
            <button
              type="button"
              className="w-full bg-gray-300 text-gray-600 py-4 px-6 rounded-lg font-light text-lg cursor-not-allowed"
              disabled
            >
              Select an option
            </button>
          ) : isOutOfStock(selectedModel.availability) ? (
            <button
              type="button"
              className="w-full bg-black text-white py-4 px-6 rounded-lg font-light text-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Out of Stock - Contact Us
            </button>
          ) : (
            <button
              type="button"
              className="w-full bg-black text-white py-4 md:px-6 rounded-lg font-light text-lg hover:bg-gray-800 transition-colors duration-200"
              onClick={() => {
                const pid = extractPublicId(images[selectedModel.color]);
                navigate(
                  `/checkout?bikeid=${bike._id}&color=${
                    selectedModel.color
                  }&size=${selectedModel.size}&image=${encodeURIComponent(
                    pid || ""
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
          <AboutSection bike={bike} />
        </div>

        <WhyBuyNsbsGrid className="mt-16 mb-16 mx-8 md:hidden block" />
      </div>
    </div>
  );
};

export default BikeLandingPageUpdated;
