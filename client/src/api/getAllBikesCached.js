import axios from "axios";

const apiBase = () => process.env.REACT_APP_VERCEL_DOMAIN || "";

let bikesCache;
let inflightPromise;

/**
 * Fetches all bikes once per session; retries after failure when called again.
 */
export function getAllBikesCached() {
  if (bikesCache !== undefined) {
    return Promise.resolve(bikesCache);
  }
  if (!inflightPromise) {
    inflightPromise = axios
      .get(`${apiBase()}/api/bikes/`, { withCredentials: true })
      .then((res) => {
        bikesCache = res.data ?? [];
        return bikesCache;
      })
      .catch((err) => {
        bikesCache = undefined;
        throw err;
      })
      .finally(() => {
        inflightPromise = null;
      });
  }
  return inflightPromise;
}

export function invalidateAllBikesCache() {
  bikesCache = undefined;
  inflightPromise = null;
}
