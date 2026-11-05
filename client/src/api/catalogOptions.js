import axios from "axios";
import { useEffect, useState } from "react";

const apiBase = process.env.REACT_APP_VERCEL_DOMAIN;

/** Shown until the saved lists load (matches the server defaults). */
export const DEFAULT_CATALOG = {
  brands: ["Norco", "Ibis", "Transition"],
  sizes: ['10"', '12"', '14"', '16"', '20"', '24"', "Short", "Long", "X-Long", "XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "1", "2", "3", "4", "5"],
};

let current = null;
let inflight = null;
const listeners = new Set();

function publish(next) {
  current = next;
  listeners.forEach((listener) => listener(next));
}

export function loadCatalogOptions() {
  if (!inflight) {
    inflight = axios
      .get(`${apiBase}/api/catalog`, { withCredentials: true })
      .then((res) => publish(res.data))
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** Saves `{ brands }` and/or `{ sizes }`; every component using the lists updates. */
export async function saveCatalogOptions(patch) {
  const res = await axios.patch(`${apiBase}/api/catalog`, patch, { withCredentials: true });
  publish(res.data);
  return res.data;
}

/** The shop-wide brand and size lists for admin forms. */
export function useCatalogOptions() {
  const [value, setValue] = useState(current || DEFAULT_CATALOG);
  useEffect(() => {
    listeners.add(setValue);
    if (current) setValue(current);
    else loadCatalogOptions().catch(() => {});
    return () => listeners.delete(setValue);
  }, []);
  return value;
}
