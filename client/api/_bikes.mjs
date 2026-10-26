/**
 * Public bike list for the crawler-preview and sitemap functions. Uses the list endpoint rather
 * than GET /api/bikes/:id, which counts a shopper view on every request.
 */

const API_BASE = (
  process.env.SEO_API_URL ||
  process.env.REACT_APP_VERCEL_DOMAIN ||
  "https://nsbs-mern-api.vercel.app"
).replace(/\/+$/, "");

const TTL_MS = 5 * 60 * 1000;
let cache = null;

export async function getPublicBikes() {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.list;
  const res = await fetch(`${API_BASE}/api/bikes/`, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`Bikes API responded ${res.status}`);
  const list = await res.json();
  if (!Array.isArray(list)) throw new Error("Bikes API returned an unexpected payload");
  cache = { list, at: Date.now() };
  return list;
}
