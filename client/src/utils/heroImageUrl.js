/**
 * Normalize stored hero image value: public files as site-root paths, keep absolute URLs as-is.
 * @param {string} raw
 * @returns {string}
 */
export function normalizeHeroImageInput(raw) {
  if (raw == null || typeof raw !== "string") return "";
  const t = raw.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t) || t.startsWith("//")) return t;
  return t.startsWith("/") ? t : `/${t}`;
}

/**
 * Safe `img` src: encodes path segments for spaces etc.; leaves http(s) URLs unchanged.
 * @param {string} url
 * @returns {string}
 */
export function heroImageSrc(url) {
  const t = normalizeHeroImageInput(url);
  if (!t) return "";
  if (/^https?:\/\//i.test(t) || t.startsWith("//")) return t;
  try {
    return encodeURI(t);
  } catch {
    return t;
  }
}

const CLOUDINARY_IMAGE_UPLOAD = "/image/upload/";

/**
 * Hero banner delivery: smaller, auto format/quality from Cloudinary; local / CDN URLs unchanged.
 * Inserts transformation segment only when the URL is a Cloudinary upload with no existing chain.
 * @param {string} url
 * @returns {string}
 */
export function heroHeaderDeliverySrc(url) {
  const t = normalizeHeroImageInput(url);
  if (!t) return "";
  if (!/^https?:\/\//i.test(t) && !t.startsWith("//")) {
    return heroImageSrc(url);
  }
  const u = t.startsWith("//") ? `https:${t}` : t;
  const idx = u.indexOf(CLOUDINARY_IMAGE_UPLOAD);
  if (idx === -1) return u;
  const rest = u.slice(idx + CLOUDINARY_IMAGE_UPLOAD.length);
  const firstSeg = rest.split("/")[0] ?? "";
  // Signed or tokenized URLs — leave unchanged
  if (firstSeg.startsWith("s--")) return u;
  // Already has a transformation chain (comma) or starts with common transform keys
  if (
    firstSeg.includes(",") ||
    /^(f_|q_|c_|w_|h_|ar_|dpr_|e_|fl_|so_|bo_|t_|x_|y_)/i.test(firstSeg)
  ) {
    return u;
  }
  const chain = "f_auto,q_auto:good,w_2400,c_limit,dpr_auto";
  return `${u.slice(0, idx + CLOUDINARY_IMAGE_UPLOAD.length)}${chain}/${rest}`;
}
