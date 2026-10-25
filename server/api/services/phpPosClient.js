const axios = require("axios");

function getApiRoot() {
  const base = process.env.PHP_BASE_URL || "";
  if (!base.trim()) return null;
  const trimmed = base.replace(/\/$/, "");
  const suffix = "/index.php/api/v1";
  // Avoid https://store/.../index.php/api/v1/index.php/api/v1 if BASE_URL already includes the API path.
  if (trimmed.endsWith(suffix)) return trimmed;
  return `${trimmed}${suffix}`;
}

/**
 * @returns {string|null} Human-readable reason sync is disabled, or null if configured.
 */
function explainPhpPosSyncDisabled() {
  if (process.env.PHP_POS_SYNC_ENABLED === "false") {
    return 'PHP_POS_SYNC_ENABLED is "false" — remove it or set any other value to allow sync.';
  }
  const base = process.env.PHP_BASE_URL;
  if (base == null || !String(base).trim()) {
    return "PHP_BASE_URL is missing or empty.";
  }
  const key = process.env.PHP_API_KEY;
  if (key == null || !String(key).trim()) {
    return "PHP_API_KEY is missing or empty.";
  }
  return null;
}

function isConfigured() {
  return explainPhpPosSyncDisabled() == null;
}

function headers() {
  return {
    "x-api-key": process.env.PHP_API_KEY,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/**
 * @param {string} method
 * @param {string} pathWithQuery e.g. /items?limit=1
 * @param {object} [data]
 */
async function request(method, pathWithQuery, data) {
  const root = getApiRoot();
  if (!root || !process.env.PHP_API_KEY) {
    throw new Error("PHP POS is not configured (PHP_BASE_URL / PHP_API_KEY)");
  }
  const path = pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`;
  const url = `${root}${path}`;
  const timeout = Number(process.env.PHP_POS_TIMEOUT_MS) || 25000;
  try {
    return await axios({
      method,
      url,
      data,
      headers: headers(),
      timeout,
      validateStatus: () => true,
    });
  } catch (e) {
    const dest = String(process.env.PHP_BASE_URL || "").replace(/\/$/, "");
    if (e.code === "ECONNABORTED") {
      console.error(
        `[PHP POS] request timeout (${timeout}ms) ${method.toUpperCase()} ${path} — try PHP_POS_TIMEOUT_MS`
      );
    } else if (e.code) {
      console.error(
        `[PHP POS] request failed ${method.toUpperCase()} ${path} [${e.code}] ${e.message} (host: ${dest || "?"})`
      );
    } else {
      console.error(`[PHP POS] request failed ${method.toUpperCase()} ${path}:`, e.message || e);
    }
    throw e;
  }
}

module.exports = {
  getApiRoot,
  isConfigured,
  explainPhpPosSyncDisabled,
  request,
};
