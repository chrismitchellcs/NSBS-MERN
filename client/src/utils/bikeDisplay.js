/** True if URL is served from this site’s Cloudinary account (delete-safe). */
export function isCloudinaryUrl(url) {
  return typeof url === "string" && /res\.cloudinary\.com/i.test(url);
}

/** Cloudinary URL → publicId for cloudinary-react Image */
export function extractPublicId(cloudinaryUrl) {
  try {
    const parts = cloudinaryUrl.split("/upload/");
    if (parts.length < 2) return null;
    const path = parts[1].replace(/^v\d+\//, "");
    return decodeURIComponent(path);
  } catch {
    return null;
  }
}

/** First image URL from bike.colors JSON, or null */
export function getBikeFirstImageUrl(bike) {
  if (!bike?.colors) return null;
  try {
    const images = JSON.parse(bike.colors);
    const firstNonEmpty = Object.values(images).find(
      (v) => typeof v === "string" && v.trim() !== ""
    );
    return typeof firstNonEmpty === "string" ? firstNonEmpty : null;
  } catch {
    return null;
  }
}

/** Cloudinary file name for a bike photo: no slashes or control characters (the server rejects them), max 200. */
export function bikePhotoPublicId(...parts) {
  const printable = Array.from(parts.join(" "))
    .map((ch) => {
      const code = ch.charCodeAt(0);
      return code < 32 || code === 127 ? " " : ch;
    })
    .join("");
  return printable.replace(/[\\/]+/g, "-").trim().replace(/\s+/g, "-").slice(0, 200);
}
