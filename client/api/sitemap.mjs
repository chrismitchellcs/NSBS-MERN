/** /sitemap.xml, built from the bikes currently listed in the shop (rewritten here by vercel.json). */
import { getPublicBikes } from "./_bikes.mjs";
import { SITE_URL, bikeImages, bikePath, brandPath, seoBrand } from "../src/seo/seoData.mjs";

const STATIC_PATHS = ["/", "/shop", "/service", "/contact", "/return-policy"];

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function buildSitemap(bikes) {
  // Bikes without a photo are hidden from the shop grid, so they stay out of the sitemap too.
  const listed = bikes.filter((b) => b?._id && seoBrand(b.brand) && bikeImages(b).length);
  const brands = [...new Set(listed.map((b) => seoBrand(b.brand)))];

  const entry = (path, image) =>
    `  <url>\n    <loc>${escapeXml(`${SITE_URL}${path === "/" ? "/" : path}`)}</loc>${
      image ? `\n    <image:image><image:loc>${escapeXml(image)}</image:loc></image:image>` : ""
    }\n  </url>`;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...STATIC_PATHS.map((p) => entry(p)),
    ...brands.map((b) => entry(brandPath(b))),
    ...listed.map((b) => entry(bikePath(b), bikeImages(b)[0])),
    "</urlset>",
    "",
  ].join("\n");
}

export default async function handler(req, res) {
  let bikes;
  try {
    bikes = await getPublicBikes();
  } catch (err) {
    console.error("sitemap:", err.message);
    res.statusCode = 503;
    res.setHeader("Retry-After", "3600");
    res.end("Sitemap temporarily unavailable");
    return;
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
  res.end(buildSitemap(bikes));
}
