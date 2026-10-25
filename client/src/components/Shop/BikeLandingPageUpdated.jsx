import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Button, Stack, Typography } from "@mui/material";
import { NAV_BAR_BG } from "components/General/NavBar";
import { useEffect, useMemo, useState } from "react";
import { Image } from "cloudinary-react";
import { useNavigate } from "react-router-dom";
import {
  bikeHasVariantPricing,
  formatCadPrice,
  hasActiveShopSale,
  variantPricingFor,
} from "utils/shopPrice";

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

/** Matches homepage `Service` / `Parts` pill CTAs */
const sectionCtaSx = {
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.95rem",
  letterSpacing: "0.02em",
  color: NAV_BAR_BG,
  px: 2.25,
  py: 1,
  borderRadius: "999px",
  border: "1px solid rgba(36, 61, 51, 0.35)",
  "&:hover": {
    bgcolor: "rgba(36, 61, 51, 0.07)",
    borderColor: NAV_BAR_BG,
  },
};

/** Same grey as homepage AboutImages — About, Why buy, and purchase column */
const NSBS_PANEL_BG = "#f6f7f6";

const marketingBandSx = {
  bgcolor: NSBS_PANEL_BG,
  borderRadius: { xs: "12px", md: "14px" },
  px: { xs: 2, sm: 2.5, md: 3 },
  py: { xs: 3, md: 3.5 },
};

const purchaseColumnDividerSx = {
  borderLeft: { xs: "none", md: "1px solid rgba(0, 0, 0, 0.08)" },
};

const purchaseFooterSx = {
  bgcolor: NSBS_PANEL_BG,
  borderTop: "1px solid rgba(0, 0, 0, 0.08)",
};

const whyBuyNsbsItems = [
  {
    title: "Lifetime free tune-ups",
    body: "FREE drivetrain and brake adjustments, wheel truing, and additional maintenance whenever you need it. Original owner only.",
  },
  {
    title: "15% off parts & labour",
    body: "Save on all parts and labour for your bike. This discount applies to every NSBS customer, on every purchase.",
  },
  {
    title: "Custom bike setup",
    body: "Professional help with accessories, fitting, and suspension setup tailored to how you ride.",
  },
];

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

function normalizeColorKey(color) {
  return String(color || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function colorHasImage(images, color) {
  const want = normalizeColorKey(color);
  if (!want) return false;
  const entries = Object.entries(images || {});
  return entries.some(([k, v]) => {
    if (normalizeColorKey(k) !== want) return false;
    return typeof v === "string" && v.trim() !== "";
  });
}

/** Homepage-aligned band: `AboutImages` bg + `Service`-style type */
function WhyBuyNsbsGrid({ className }) {
  return (
    <Box
      component="section"
      aria-label="Why buy from North Shore Bike Shop"
      className={className}
      sx={marketingBandSx}
    >
      <Typography
        component="h2"
        sx={{
          m: 0,
          mb: { xs: 2.5, md: 3 },
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: { xs: "0.06em", sm: "0.08em" },
          fontSize: { xs: "1.25rem", sm: "1.45rem", md: "1.55rem" },
          color: NAV_BAR_BG,
          lineHeight: 1.15,
          textAlign: "center",
        }}
      >
        Why buy from NSBS?
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: { xs: 2, md: 2.25 },
          alignItems: "stretch",
        }}
      >
        {whyBuyNsbsItems.map((item) => (
          <Box
            key={item.title}
            sx={{
              bgcolor: "#fff",
              borderRadius: "12px",
              p: { xs: 2.25, md: 2.75 },
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.06)",
              transition: "box-shadow 0.25s ease",
              "@media (hover: hover)": {
                "&:hover": {
                  boxShadow: "0 14px 40px rgba(0,0,0,0.09)",
                },
              },
            }}
          >
            <Typography
              component="h3"
              sx={{
                m: 0,
                mb: 1.25,
                fontWeight: 700,
                fontSize: { xs: "1.02rem", md: "1.06rem" },
                color: "#1a1a1a",
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
              }}
            >
              {item.title}
            </Typography>
            <Typography
              sx={{
                m: 0,
                fontSize: { xs: "0.94rem", md: "0.97rem" },
                lineHeight: 1.62,
                color: "rgba(0,0,0,0.74)",
              }}
            >
              {item.body}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function AboutSection({ bike }) {
  if (!bike?.description && !bike?.link) return null;

  return (
    <Box component="section" aria-label="About this bike" sx={marketingBandSx}>
      <Typography
        component="h2"
        sx={{
          m: 0,
          mb: { xs: 2.5, md: 3 },
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: { xs: "0.06em", sm: "0.08em" },
          fontSize: { xs: "1.25rem", sm: "1.45rem", md: "1.55rem" },
          color: NAV_BAR_BG,
          lineHeight: 1.15,
          textAlign: "left",
        }}
      >
        About
      </Typography>
      {bike.description ? (
        <Typography
          sx={{
            m: 0,
            mb: bike.link ? 2.5 : 0,
            fontSize: { xs: "1rem", md: "1.0625rem" },
            lineHeight: 1.65,
            color: "rgba(0,0,0,0.78)",
            fontWeight: 400,
            textAlign: "left",
          }}
        >
          {bike.description}
        </Typography>
      ) : null}
      {bike.link ? (
        <Stack alignItems="flex-start">
          <Button
            component="a"
            href={bike.link}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon sx={{ fontSize: 18 }} aria-hidden />}
            sx={{ ...sectionCtaSx, bgcolor: "#fff" }}
          >
            See more
          </Button>
        </Stack>
      ) : null}
    </Box>
  );
}

const BikeLandingPageUpdated = ({ bike, navHidden = false }) => {
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
    const uniqueModels = Array.from(uniqueModelsMap.values()).filter((m) =>
      colorHasImage(images, m?.color)
    );
    return [...uniqueModels].sort((a, b) => {
      const sizeDiff = allSizes.indexOf(a.size) - allSizes.indexOf(b.size);
      if (sizeDiff !== 0) return sizeDiff;
      return a.color.localeCompare(b.color);
    });
  }, [models, storeModels, images]);

  // Listed price is the cheapest variant's; once a variant is picked, show that variant's price.
  const displayPricing = useMemo(
    () =>
      selectedModel
        ? variantPricingFor(bike, selectedModel.color, selectedModel.size)
        : { price: bike?.price, saleprice: bike?.saleprice },
    [bike, selectedModel]
  );
  const showFromLabel = useMemo(
    () => !selectedModel && bikeHasVariantPricing(bike),
    [bike, selectedModel]
  );
  const hasActiveSale = hasActiveShopSale(displayPricing.saleprice);

  const mainPublicId = extractPublicId(currentImage);
  const mainAlt = bikeTitle
    ? `${bikeTitle} — product image`
    : "Bicycle product image";

  return (
    <div className="w-full flex md:flex-row flex-col">
      {/* flex-1: uses all space left of the buy column; hero capped so it doesn’t dwarf the panel on huge screens */}
      <div className="w-full md:flex-1 md:min-w-0 mt-6 px-4 sm:px-6 lg:px-10 md:pr-6 lg:pr-10">
        {mainPublicId ? (
          <div className="w-full flex justify-center md:justify-start lg:justify-center px-0 sm:px-2">
            {/*
              Stable min-height + same grey as panels avoids layout jump when src swaps.
              key only bike._id so Cloudinary Image updates in place instead of remounting per colour.
            */}
            <Box
              sx={{
                width: "100%",
                maxWidth: {
                  xs: "min(100%, 600px)",
                  sm: "min(100%, 600px)",
                  md: "min(100%, 720px)",
                  lg: "min(100%, 800px)",
                  xl: "min(100%, 880px)",
                },
                minHeight: { xs: 260, sm: 300, md: 340, lg: 360 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: NSBS_PANEL_BG,
                borderRadius: "12px",
                mx: { xs: "auto", md: 0, lg: "auto" },
              }}
            >
              <Image
                key={bike._id}
                cloudName={CLOUD_NAME}
                publicId={mainPublicId}
                width="1000"
                crop="pad"
                quality="100"
                fetchFormat="auto"
                alt={mainAlt}
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  maxHeight: "min(72vh, 640px)",
                  objectFit: "contain",
                }}
              />
            </Box>
          </div>
        ) : (
          <div
            className="w-full max-w-[min(100%,800px)] md:mx-0 mx-auto min-h-[200px] flex items-center justify-center bg-gray-100 text-gray-500 text-sm rounded"
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
        <div className="mx-8 mb-8 mt-8 md:mt-10 md:block hidden">
          <AboutSection bike={bike} />
        </div>
        <WhyBuyNsbsGrid className="mt-16 mb-16 mx-8 md:block hidden" />
      </div>
      <Box
        component="aside"
        aria-label="Pricing and availability"
        className={`w-full md:shrink-0 md:w-[min(420px,40vw)] lg:w-[min(460px,36vw)] xl:w-[min(500px,34vw)] sticky md:self-start flex flex-col [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overflow-hidden justify-center items-stretch ${
          navHidden
            ? "top-0 md:h-screen"
            : "top-[80px] md:h-[calc(100vh-80px)]"
        }`}
        sx={{
          bgcolor: NSBS_PANEL_BG,
          ...purchaseColumnDividerSx,
        }}
      >
        <Box
          className="flex-1 overflow-y-auto w-full min-w-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          sx={{
            py: { xs: 2.5, md: 3 },
            px: { xs: 2, sm: 2.25 },
            pl: { md: 2.5 },
            pr: { md: 3, lg: 3.5 },
          }}
        >
          <Stack spacing={2.25}>
            <Box>
              <Typography
                component="h1"
                sx={{
                  m: 0,
                  fontWeight: 800,
                  fontSize: { xs: "1.35rem", sm: "1.5rem" },
                  letterSpacing: "-0.02em",
                  color: "#1a1a1a",
                  lineHeight: 1.2,
                }}
              >
                {bike.brand} {bike.name}
              </Typography>
            </Box>
            <Box>
              {!hasActiveSale ? (
                <Stack direction="row" alignItems="baseline" flexWrap="wrap" columnGap={1} rowGap={0.5}>
                  {showFromLabel ? (
                    <Typography sx={{ m: 0, fontSize: "1.5rem", fontWeight: 300, color: "#1a1a1a" }}>
                      From
                    </Typography>
                  ) : null}
                  <Typography
                    component="p"
                    sx={{
                      m: 0,
                      fontSize: "1.5rem",
                      fontWeight: 300,
                      color: "#1a1a1a",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    ${formatCadPrice(displayPricing.price)}
                  </Typography>
                  <Typography
                    sx={{
                      m: 0,
                      fontSize: "1.5rem",
                      fontWeight: 300,
                      color: "rgba(0,0,0,0.55)",
                    }}
                  >
                    CAD
                  </Typography>
                </Stack>
              ) : (
                <Stack direction="row" alignItems="baseline" flexWrap="wrap" columnGap={1} rowGap={0.5}>
                  {showFromLabel ? (
                    <Typography sx={{ m: 0, fontSize: "1.5rem", fontWeight: 300, color: "#1a1a1a" }}>
                      From
                    </Typography>
                  ) : null}
                  <Typography
                    sx={{
                      m: 0,
                      fontSize: "1.5rem",
                      fontWeight: 300,
                      color: "rgba(0,0,0,0.45)",
                      textDecoration: "line-through",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    ${formatCadPrice(displayPricing.price)}
                  </Typography>
                  <Typography
                    sx={{
                      m: 0,
                      fontSize: "1.5rem",
                      fontWeight: 300,
                      color: "#1a1a1a",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    ${formatCadPrice(displayPricing.saleprice)}
                  </Typography>
                  <Typography
                    sx={{
                      m: 0,
                      fontSize: "1.5rem",
                      fontWeight: 300,
                      color: "rgba(0,0,0,0.55)",
                    }}
                  >
                    CAD
                  </Typography>
                </Stack>
              )}
            </Box>
            <Box>
              <Typography
                component="p"
                sx={{
                  m: 0,
                  mb: 1.5,
                  color: NAV_BAR_BG,
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Select size / colour
              </Typography>
            <Stack spacing={1.25} sx={{ width: "100%", maxWidth: "100%" }}>
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
                    fullWidth
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
            </Box>
          </Stack>
        </Box>

        <Box
          className="sticky bottom-0 w-full shrink-0"
          sx={{
            ...purchaseFooterSx,
            pt: 2,
            pb: { xs: 3, md: 3 },
            px: { xs: 2, sm: 2.25 },
            pl: { md: 2.5 },
            pr: { md: 3, lg: 3.5 },
          }}
        >
          {!selectedModel ? (
            <Button
              type="button"
              fullWidth
              disabled
              variant="contained"
              disableElevation
              sx={{
                py: 1.75,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 400,
                fontSize: "1.05rem",
                bgcolor: "rgba(0,0,0,0.12)",
                color: "rgba(0,0,0,0.45)",
                "&.Mui-disabled": {
                  bgcolor: "rgba(0,0,0,0.12)",
                  color: "rgba(0,0,0,0.45)",
                },
              }}
            >
              Select an option
            </Button>
          ) : isOutOfStock(selectedModel.availability) ? (
            <Button
              type="button"
              fullWidth
              variant="contained"
              disableElevation
              sx={{
                py: 1.75,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 400,
                fontSize: "1.05rem",
                bgcolor: "#1a1a1a",
                color: "#fff",
                "&:hover": { bgcolor: "#333" },
              }}
              onClick={() => {
                const pid = extractPublicId(images[selectedModel.color]);
                navigate(
                  `/checkout?bikeid=${bike._id}&color=${encodeURIComponent(
                    selectedModel.color
                  )}&size=${encodeURIComponent(
                    selectedModel.size
                  )}&image=${encodeURIComponent(
                    pid || ""
                  )}&availability=${encodeURIComponent(
                    selectedModel.availability || ""
                  )}`
                );
              }}
            >
              Out of Stock - Contact Us
            </Button>
          ) : (
            <Button
              type="button"
              fullWidth
              variant="contained"
              disableElevation
              sx={{
                py: 1.75,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 400,
                fontSize: "1.05rem",
                bgcolor: "#1a1a1a",
                color: "#fff",
                "&:hover": { bgcolor: "#333" },
              }}
              onClick={() => {
                const pid = extractPublicId(images[selectedModel.color]);
                navigate(
                  `/checkout?bikeid=${bike._id}&color=${encodeURIComponent(
                    selectedModel.color
                  )}&size=${encodeURIComponent(
                    selectedModel.size
                  )}&image=${encodeURIComponent(
                    pid || ""
                  )}&availability=${encodeURIComponent(
                    selectedModel.availability || ""
                  )}`
                );
              }}
            >
              Buy Now / Contact Us
            </Button>
          )}
          {selectedModel && (
            <Typography
              sx={{
                mt: 1.5,
                textAlign: "center",
                fontSize: "0.875rem",
                color: "rgba(0,0,0,0.52)",
              }}
            >
              {bike.brand} {bike.name} • {selectedModel.color} •{" "}
              {selectedModel.size}
            </Typography>
          )}
        </Box>
        <div className="mx-8 mt-8 md:mb-8 md:hidden block">
          <AboutSection bike={bike} />
        </div>

        <WhyBuyNsbsGrid className="mt-16 mb-16 mx-8 md:hidden block" />
      </Box>
    </div>
  );
};

export default BikeLandingPageUpdated;
