/**
 * Crawlers and link-preview bots (Google, Facebook, iMessage, Pinkbike...) are rewritten here by
 * vercel.json. Serves the normal app HTML with the page's real title, description, share image,
 * and structured data already in <head>, plus 301s to lowercase addresses and 404s for missing
 * bikes. Shoppers never hit this; they get the static index.html.
 */
import { getPublicBikes } from "./_bikes.mjs";
import {
  BIKE_NOT_FOUND_META,
  DEFAULT_SHARE_IMAGE,
  NOT_FOUND_META,
  SITE_NAME,
  SITE_URL,
  bikePath,
  bikeSeo,
  brandPageMeta,
  brandPath,
  pageMeta,
  seoBrand,
} from "../src/seo/seoData.mjs";

const STATIC_ROUTES = {
  home: "/",
  shop: "/shop",
  service: "/service",
  contact: "/contact",
  "return-policy": "/return-policy",
};
const INTERNAL_PARAMS = ["_route", "_brand", "_id"];
const INDEX_TTL_MS = 10 * 60 * 1000;

let indexCache = null;

async function loadIndexHtml(origin) {
  if (indexCache && indexCache.origin === origin && Date.now() - indexCache.at < INDEX_TTL_MS) {
    return indexCache.html;
  }
  // Protected preview deployments need Vercel's automation bypass to fetch their own files.
  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  const res = await fetch(`${origin}/index.html`, {
    headers: bypass ? { "x-vercel-protection-bypass": bypass } : {},
    signal: AbortSignal.timeout(5000),
  });
  const html = res.ok ? await res.text() : "";
  if (!html.includes('id="root"')) throw new Error(`index.html unavailable (${res.status})`);
  indexCache = { html, origin, at: Date.now() };
  return html;
}

const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** Swap the default head tags for this page's (marked data-rh so react-helmet takes them over). */
export function renderHead(html, meta) {
  const image = String(meta.image || DEFAULT_SHARE_IMAGE);
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  const tag = (attr, key, content) =>
    `<meta ${attr}="${key}" content="${escapeHtml(content)}" data-rh="true"/>`;

  const tags = [
    tag("name", "description", meta.description),
    meta.noindex ? tag("name", "robots", "noindex, follow") : "",
    tag("property", "og:type", meta.type || "website"),
    tag("property", "og:site_name", SITE_NAME),
    tag("property", "og:url", meta.url || SITE_URL),
    tag("property", "og:locale", "en_CA"),
    tag("property", "og:title", meta.title),
    tag("property", "og:description", meta.description),
    tag("property", "og:image", imageUrl),
    tag("name", "twitter:card", "summary_large_image"),
    tag("name", "twitter:title", meta.title),
    tag("name", "twitter:description", meta.description),
    tag("name", "twitter:image", imageUrl),
    meta.noindex ? "" : `<link rel="canonical" href="${escapeHtml(meta.url || SITE_URL)}" data-rh="true"/>`,
    meta.jsonLd
      ? `<script type="application/ld+json" data-rh="true">${JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c")}</script>`
      : "",
  ].join("");

  // Replacer functions so "$&"-style sequences in shop text are inserted literally.
  const title = `<title>${escapeHtml(meta.title)}</title>`;
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, () => title)
    .replace(/<meta\s+(?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)"[^>]*>/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>/gi, "")
    .replace("</head>", () => `${tags}</head>`);
}

/** Works out the page's meta, HTTP status, and any redirect from the rewrite's query params. */
export async function resolvePage(params) {
  const route = params.get("_route");
  const brandParam = params.get("_brand") || "";

  if (route === "bike") {
    const id = params.get("_id") || "";
    const bike = (await getPublicBikes()).find((b) => String(b._id) === id);
    if (!bike) return { status: 404, meta: BIKE_NOT_FOUND_META };
    const canonical = bikePath(bike);
    if (`/shop/${brandParam}/${id}` !== canonical) return { redirect: canonical };
    return { status: 200, meta: bikeSeo(bike) };
  }

  if (route === "brand") {
    const brand = seoBrand(brandParam);
    if (!brand) return { status: 404, meta: NOT_FOUND_META };
    if (brandParam !== brand.toLowerCase()) return { redirect: brandPath(brand) };
    return { status: 200, meta: brandPageMeta(brand) };
  }

  const path = STATIC_ROUTES[route];
  return path ? { status: 200, meta: pageMeta(path) } : { status: 200, meta: null };
}

export default async function handler(req, res) {
  const url = new URL(req.url, "http://localhost");
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const origin = host?.startsWith("localhost") ? `http://${host}` : `https://${host}`;

  // Page HTML and bike data load in parallel to stay well inside the function time limit.
  const htmlPromise = loadIndexHtml(origin);
  htmlPromise.catch(() => {});

  let page;
  try {
    page = await resolvePage(url.searchParams);
  } catch (err) {
    // Bike data unavailable: still serve the app with its default tags rather than fail the crawl.
    console.error("seo-page:", err.message);
    page = { status: 200, meta: null };
  }

  if (page.redirect) {
    const query = new URLSearchParams(url.searchParams);
    INTERNAL_PARAMS.forEach((p) => query.delete(p));
    const qs = query.toString();
    res.statusCode = 301;
    res.setHeader("Location", `${page.redirect}${qs ? `?${qs}` : ""}`);
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
    res.end();
    return;
  }

  let html;
  try {
    html = await htmlPromise;
  } catch (err) {
    console.error("seo-page:", err.message);
    res.statusCode = 502;
    res.end("Temporarily unavailable");
    return;
  }

  res.statusCode = page.status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    page.status === 200
      ? "public, max-age=0, s-maxage=600, stale-while-revalidate=86400"
      : "public, max-age=0, s-maxage=300"
  );
  res.end(page.meta ? renderHead(html, page.meta) : html);
}
