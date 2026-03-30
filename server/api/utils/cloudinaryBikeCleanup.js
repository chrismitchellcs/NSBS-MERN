const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function publicIdFromCloudinaryUrl(url) {
  if (!url || typeof url !== "string") return null;
  if (!/cloudinary\.com/i.test(url)) return null;
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  let rest = url.slice(idx + marker.length).split("?")[0];
  while (rest.length > 0) {
    const slash = rest.indexOf("/");
    const seg = slash === -1 ? rest : rest.slice(0, slash);
    if (seg.includes(",")) {
      rest = rest.slice(seg.length + 1);
    } else {
      break;
    }
  }
  if (rest.startsWith("s--")) return null;
  rest = rest.replace(/^v\d+\//, "");
  rest = rest.replace(/\.(jpe?g|png|gif|webp|avif|bmp)$/i, "");
  try {
    return decodeURIComponent(rest);
  } catch {
    return rest;
  }
}

function collectUrlsFromJsonObject(jsonString) {
  try {
    const obj = JSON.parse(jsonString || "{}");
    if (!obj || typeof obj !== "object") return [];
    return Object.values(obj).filter((v) => typeof v === "string" && v.trim());
  } catch {
    return [];
  }
}

/**
 * Best-effort destroy for each Cloudinary URL in `colors` / `images` JSON strings.
 */
async function destroyCloudinaryImagesFromBikeColors(colorsJson, imagesJson) {
  const nameCfg = cloudinary.config().cloud_name;
  const urls = [
    ...collectUrlsFromJsonObject(colorsJson),
    ...collectUrlsFromJsonObject(imagesJson),
  ];
  for (const url of urls) {
    if (!url.includes("res.cloudinary.com")) continue;
    if (nameCfg && !url.includes(`res.cloudinary.com/${nameCfg}/`)) {
      console.warn("Skipping Cloudinary URL (different cloud):", url.slice(0, 80));
      continue;
    }
    const pid = publicIdFromCloudinaryUrl(url);
    if (!pid) continue;
    try {
      await cloudinary.uploader.destroy(pid, { invalidate: true });
    } catch (e) {
      console.error("Cloudinary destroy failed:", pid, e.message);
    }
  }
}

module.exports = { destroyCloudinaryImagesFromBikeColors };
