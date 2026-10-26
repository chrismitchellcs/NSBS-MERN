import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Image } from "cloudinary-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { brandPath } from "seo/seoData.mjs";
import { availabilityLabel, availabilityRank, isInStore, isOutOfStock } from "utils/availability";
import { NAV_BAR_BG } from "utils/brandColors";
import { SHOP_PHONE } from "utils/shopHours";
import {
  bikeHasVariantPricing,
  formatCadPrice,
  hasActiveShopSale,
  variantPricingFor,
} from "utils/shopPrice";
import SimilarBikes from "./SimilarBikes";

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

/** Sorts "Medium 29" / "Medium MX" with Medium; unknown sizes ("One Size") go last. */
function compareSizes(a, b) {
  const rank = (size) => {
    const s = String(size || "");
    const exact = allSizes.indexOf(s);
    if (exact !== -1) return [exact, ""];
    const base = allSizes.indexOf(s.split(" ")[0]);
    return base !== -1 ? [base, s] : [allSizes.length, s];
  };
  const [ra, sa] = rank(a);
  const [rb, sb] = rank(b);
  return ra - rb || sa.localeCompare(sb);
}

/** "https://www.transitionbikes.com/Bikes/Spur" → "transitionbikes.com" */
function linkHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
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
            {linkHost(bike.link) ? `Full specs on ${linkHost(bike.link)}` : "Full specs"}
          </Button>
        </Stack>
      ) : null}
    </Box>
  );
}

const pickerLabelSx = {
  m: 0,
  mb: 1,
  color: NAV_BAR_BG,
  fontWeight: 700,
  fontSize: "0.72rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const priceTextSx = { m: 0, fontSize: "1.5rem", fontWeight: 300, fontVariantNumeric: "tabular-nums" };

const buyButtonSx = {
  py: { xs: 1.4, md: 1.75 },
  borderRadius: "10px",
  textTransform: "none",
  fontWeight: 500,
  fontSize: "1.05rem",
  bgcolor: NAV_BAR_BG,
  color: "#fff",
  "&:hover": { bgcolor: "#1e332b" },
  "&.Mui-disabled": { bgcolor: "rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.45)" },
};

function optionSx(selected, muted) {
  return {
    m: 0,
    textTransform: "none",
    borderRadius: "10px",
    border: "1px solid",
    borderColor: selected ? NAV_BAR_BG : "rgba(0,0,0,0.18)",
    boxShadow: selected ? `inset 0 0 0 1px ${NAV_BAR_BG}` : "none",
    bgcolor: selected ? "rgba(36, 61, 51, 0.06)" : "#fff",
    color: muted ? "rgba(0,0,0,0.45)" : "#1a1a1a",
    transition: "border-color 0.15s, background-color 0.15s",
    "&:hover": { borderColor: NAV_BAR_BG, bgcolor: selected ? "rgba(36, 61, 51, 0.08)" : "rgba(36, 61, 51, 0.03)" },
    "&.Mui-disabled": { opacity: 0.4, borderStyle: "dashed", color: "rgba(0,0,0,0.5)" },
  };
}

function ShopPerks() {
  return (
    <Stack spacing={0.75} sx={{ pt: 0.5 }}>
      {whyBuyNsbsItems.slice(0, 2).map((item) => (
        <Stack key={item.title} direction="row" spacing={1} alignItems="center">
          <CheckRoundedIcon sx={{ fontSize: 18, color: NAV_BAR_BG }} aria-hidden />
          <Typography sx={{ fontSize: "0.92rem", color: "rgba(0,0,0,0.78)" }}>{item.title}</Typography>
        </Stack>
      ))}
      <Stack direction="row" spacing={1} alignItems="center">
        <PhoneOutlinedIcon sx={{ fontSize: 18, color: NAV_BAR_BG }} aria-hidden />
        <Typography sx={{ fontSize: "0.92rem", color: "rgba(0,0,0,0.78)" }}>
          Questions? Call{" "}
          <Link href={`tel:${SHOP_PHONE.tel}`} sx={{ color: NAV_BAR_BG, fontWeight: 600 }}>
            {SHOP_PHONE.display}
          </Link>
        </Typography>
      </Stack>
    </Stack>
  );
}

const BikeLandingPageUpdated = ({ bike, navHidden = false }) => {
  const navigate = useNavigate();
  const images = useMemo(() => parseBikeColors(bike?.colors), [bike?.colors]);
  const [currentImage, setCurrentImage] = useState(() => firstColorImage(images));
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const bikeTitle = [bike?.brand, bike?.name].filter(Boolean).join(" ").trim();

  const models = useMemo(() => parseBikeModelsArray(bike?.models), [bike?.models]);
  const storeModels = useMemo(() => parseBikeModelsArray(bike?.inStock), [bike?.inStock]);

  /** One row per colour + size (shop stock wins over the vendor's), only for colours with a photo. */
  const sortedModels = useMemo(() => {
    const unique = new Map();
    [...models, ...storeModels].forEach((model) => {
      const key = `${model.color}-${model.size}`;
      const existing = unique.get(key);
      if (!existing || (isInStore(model.availability) && !isInStore(existing.availability))) {
        unique.set(key, model);
      }
    });
    return Array.from(unique.values())
      .filter((m) => colorHasImage(images, m?.color))
      .sort((a, b) => compareSizes(a.size, b.size) || String(a.color).localeCompare(String(b.color)));
  }, [models, storeModels, images]);

  /** Each size with its best availability across colours. */
  const sizeOptions = useMemo(() => {
    const bySize = new Map();
    sortedModels.forEach((m) => {
      const prev = bySize.get(m.size);
      if (!prev || availabilityRank(m.availability) < availabilityRank(prev.availability)) {
        bySize.set(m.size, m);
      }
    });
    return Array.from(bySize.values()).map((m) => ({ size: m.size, availability: m.availability }));
  }, [sortedModels]);

  const colorOptions = useMemo(
    () => Object.entries(images).filter(([, url]) => typeof url === "string" && url.trim() !== ""),
    [images]
  );

  const findModel = (size, color) =>
    sortedModels.find((m) => m.size === size && normalizeColorKey(m.color) === normalizeColorKey(color)) || null;

  const selectedModel = selectedSize && selectedColor ? findModel(selectedSize, selectedColor) : null;

  useEffect(() => {
    setCurrentImage(firstColorImage(images));
    setSelectedColor(null);
    setSelectedSize(null);
  }, [bike?._id, images]);

  const chooseColor = (color) => {
    setSelectedColor(color);
    if (images[color]) setCurrentImage(images[color]);
  };

  const chooseSize = (size) => {
    setSelectedSize(size);
    const offered = colorOptions.filter(([color]) => findModel(size, color));
    if (selectedColor && !findModel(size, selectedColor)) setSelectedColor(null);
    if (offered.length === 1) chooseColor(offered[0][0]);
  };

  // Only one size: nothing to choose (and pick the colour too if that size has just one).
  useEffect(() => {
    if (sizeOptions.length === 1) chooseSize(sizeOptions[0].size);
    // chooseSize is recreated every render; this should only run when the options change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeOptions]);

  // Listed price is the cheapest variant's; once a variant is picked, show that variant's price.
  const displayPricing = useMemo(
    () =>
      selectedModel
        ? variantPricingFor(bike, selectedModel.color, selectedModel.size)
        : { price: bike?.price, saleprice: bike?.saleprice },
    [bike, selectedModel]
  );
  const showFromLabel = !selectedModel && bikeHasVariantPricing(bike);
  const hasActiveSale = hasActiveShopSale(displayPricing.saleprice);
  const saving = hasActiveSale ? Number(displayPricing.price) - Number(displayPricing.saleprice) : 0;

  const mainPublicId = extractPublicId(currentImage);
  const mainAlt = bikeTitle || "Bike";

  const goToCheckout = () => {
    const pid = extractPublicId(images[selectedColor] || images[selectedModel.color] || currentImage);
    navigate(
      `/checkout?bikeid=${bike._id}&color=${encodeURIComponent(selectedModel.color)}&size=${encodeURIComponent(
        selectedModel.size
      )}&image=${encodeURIComponent(pid || "")}&availability=${encodeURIComponent(selectedModel.availability || "")}`
    );
  };

  const buyLabel = !selectedSize
    ? "Select a size"
    : !selectedModel
      ? "Select a colour"
      : isOutOfStock(selectedModel.availability)
        ? "Out of stock, contact us"
        : "Buy Now / Contact Us";

  return (
    <>
      <div className="w-full flex md:flex-row flex-col">
        <div className="w-full md:flex-1 md:min-w-0 mt-4 md:mt-6 px-4 sm:px-6 lg:px-10 md:pr-6 lg:pr-10">
          {bike?.brand ? (
            <Button
              component={RouterLink}
              to={brandPath(bike.brand)}
              startIcon={<ArrowBackIosNewRoundedIcon sx={{ fontSize: "14px !important" }} />}
              sx={{ mb: 1.5, px: 1, ml: -1, textTransform: "none", fontWeight: 600, color: NAV_BAR_BG }}
            >
              {bike.brand} bikes
            </Button>
          ) : null}
          {mainPublicId ? (
            <div className="w-full flex justify-center md:justify-start lg:justify-center px-0 sm:px-2">
              {/* Stable min-height + panel grey avoids a layout jump when the colour (src) changes. */}
              <Box
                sx={{
                  width: "100%",
                  maxWidth: {
                    xs: "min(100%, 600px)",
                    md: "min(100%, 720px)",
                    lg: "min(100%, 800px)",
                    xl: "min(100%, 880px)",
                  },
                  minHeight: { xs: 220, sm: 300, md: 340, lg: 360 },
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
                  quality="auto:good"
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
          <div className="mx-8 mb-8 mt-8 md:mt-10 md:block hidden">
            <AboutSection bike={bike} />
          </div>
          <WhyBuyNsbsGrid className="mt-16 mb-16 mx-8 md:block hidden" />
        </div>

        <Box
          component="aside"
          aria-label="Pricing and availability"
          className={`w-full md:shrink-0 md:w-[min(420px,40vw)] lg:w-[min(460px,36vw)] xl:w-[min(500px,34vw)] md:sticky md:self-start flex flex-col md:overflow-hidden justify-center items-stretch ${
            navHidden ? "md:top-0 md:h-screen" : "md:top-[80px] md:h-[calc(100vh-80px)]"
          }`}
          sx={{ bgcolor: NSBS_PANEL_BG, mt: { xs: 2, md: 0 }, ...purchaseColumnDividerSx }}
        >
          <Box
            className="flex-1 overflow-y-auto w-full min-w-0"
            sx={{
              py: { xs: 2.5, md: 3 },
              px: { xs: 2, sm: 2.25 },
              pl: { md: 2.5 },
              pr: { md: 3, lg: 3.5 },
              scrollbarWidth: "thin",
            }}
          >
            <Stack spacing={2.5}>
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
                <Stack direction="row" alignItems="baseline" flexWrap="wrap" columnGap={1} rowGap={0.5} sx={{ mt: 1 }}>
                  {showFromLabel ? <Typography sx={{ ...priceTextSx, color: "#1a1a1a" }}>From</Typography> : null}
                  {hasActiveSale ? (
                    <>
                      <Typography sx={{ ...priceTextSx, color: "rgba(0,0,0,0.45)", textDecoration: "line-through" }}>
                        ${formatCadPrice(displayPricing.price)}
                      </Typography>
                      <Typography sx={{ ...priceTextSx, color: "#1a1a1a" }}>
                        ${formatCadPrice(displayPricing.saleprice)}
                      </Typography>
                    </>
                  ) : (
                    <Typography component="p" sx={{ ...priceTextSx, color: "#1a1a1a" }}>
                      ${formatCadPrice(displayPricing.price)}
                    </Typography>
                  )}
                  <Typography sx={{ ...priceTextSx, color: "rgba(0,0,0,0.55)" }}>CAD</Typography>
                  {saving > 0 && !showFromLabel ? (
                    <Box
                      component="span"
                      sx={{
                        alignSelf: "center",
                        px: 1,
                        py: 0.25,
                        borderRadius: "6px",
                        bgcolor: "#fde8e8",
                        color: "#b42318",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      Save ${formatCadPrice(saving)}
                    </Box>
                  ) : null}
                </Stack>
              </Box>

              {sizeOptions.length ? (
                <Box component="fieldset" sx={{ border: 0, m: 0, p: 0, minWidth: 0 }}>
                  <Typography component="legend" sx={pickerLabelSx}>
                    Size{selectedSize ? `: ${selectedSize}` : ""}
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(92px, 1fr))", gap: 1 }}>
                    {sizeOptions.map(({ size, availability }) => {
                      const selected = selectedSize === size;
                      const oos = isOutOfStock(availability);
                      return (
                        <Button
                          key={size}
                          onClick={() => chooseSize(size)}
                          aria-pressed={selected}
                          sx={{ ...optionSx(selected, oos), flexDirection: "column", py: 1, minHeight: 56 }}
                        >
                          <Box component="span" sx={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.2 }}>
                            {size}
                          </Box>
                          <Box
                            component="span"
                            sx={{
                              fontSize: "0.7rem",
                              mt: 0.25,
                              lineHeight: 1.2,
                              color: isInStore(availability) ? "#15803d" : "rgba(0,0,0,0.5)",
                              fontWeight: isInStore(availability) ? 700 : 400,
                            }}
                          >
                            {isInStore(availability) ? "In store" : oos ? "Out of stock" : "\u00a0"}
                          </Box>
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              ) : null}

              {colorOptions.length ? (
                <Box component="fieldset" sx={{ border: 0, m: 0, p: 0, minWidth: 0 }}>
                  <Typography component="legend" sx={pickerLabelSx}>
                    Colour{selectedColor ? `: ${selectedColor}` : ""}
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 1 }}>
                    {colorOptions.map(([color, url]) => {
                      const model = selectedSize ? findModel(selectedSize, color) : null;
                      const unavailable = Boolean(selectedSize) && !model;
                      const selected = selectedColor === color;
                      const thumbPid = extractPublicId(url);
                      return (
                        <Button
                          key={color}
                          onClick={() => chooseColor(color)}
                          disabled={unavailable}
                          aria-pressed={selected}
                          title={unavailable ? `Not available in ${selectedSize}` : undefined}
                          sx={{
                            ...optionSx(selected, model && isOutOfStock(model.availability)),
                            flexDirection: "column",
                            alignItems: "stretch",
                            p: 0.75,
                          }}
                        >
                          {thumbPid ? (
                            <Image
                              cloudName={CLOUD_NAME}
                              publicId={thumbPid}
                              width="200"
                              crop="pad"
                              quality="auto"
                              fetchFormat="auto"
                              alt=""
                              style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }}
                            />
                          ) : null}
                          <Box component="span" sx={{ fontSize: "0.75rem", fontWeight: 600, mt: 0.5, lineHeight: 1.2 }}>
                            {color}
                          </Box>
                          {model ? (
                            <Box
                              component="span"
                              sx={{
                                fontSize: "0.68rem",
                                lineHeight: 1.2,
                                color: isInStore(model.availability) ? "#15803d" : "rgba(0,0,0,0.55)",
                                fontWeight: isInStore(model.availability) ? 700 : 400,
                              }}
                            >
                              {availabilityLabel(model.availability)}
                            </Box>
                          ) : null}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              ) : null}

              <ShopPerks />
            </Stack>
          </Box>

          <Box
            className="sticky bottom-0 w-full shrink-0"
            sx={{
              ...purchaseFooterSx,
              zIndex: 2,
              pt: { xs: 1.5, md: 2 },
              pb: { xs: "calc(12px + env(safe-area-inset-bottom))", md: 3 },
              px: { xs: 2, sm: 2.25 },
              pl: { md: 2.5 },
              pr: { md: 3, lg: 3.5 },
            }}
          >
            <Button
              type="button"
              fullWidth
              variant="contained"
              disableElevation
              disabled={!selectedModel}
              onClick={goToCheckout}
              sx={buyButtonSx}
            >
              {buyLabel}
            </Button>
            {selectedModel ? (
              <Typography sx={{ mt: 1, textAlign: "center", fontSize: "0.85rem", color: "rgba(0,0,0,0.55)" }}>
                {selectedModel.size}, {selectedModel.color}: {availabilityLabel(selectedModel.availability)}
              </Typography>
            ) : null}
          </Box>
          <div className="mx-8 mt-8 md:mb-8 md:hidden block">
            <AboutSection bike={bike} />
          </div>

          <WhyBuyNsbsGrid className="mt-16 mb-16 mx-8 md:hidden block" />
        </Box>
      </div>
      <SimilarBikes bike={bike} />
    </>
  );
};

export default BikeLandingPageUpdated;
