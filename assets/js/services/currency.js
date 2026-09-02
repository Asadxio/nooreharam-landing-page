/**
 * Noor-E-Haram — Real Live Currency Service
 * Fetches runtime SAR -> INR exchange rate with timeout, fallbacks,
 * localStorage caching (1-hour TTL), and non-blocking initialization.
 */

const STORAGE_KEY = 'nh_currency_sar_inr_v1';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const FETCH_TIMEOUT_MS = 4000; // 4 seconds timeout

const PRIMARY_API = 'https://open.er-api.com/v6/latest/SAR';
const FALLBACK_API = 'https://api.exchangerate-api.com/v4/latest/SAR';

let currentRateData = null;

/**
 * Reads cached currency data from localStorage if present and valid
 */
function readCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && typeof data.rate === 'number' && data.timestamp) {
      return data;
    }
  } catch (e) {
    console.warn('[Currency] Cache read error:', e);
  }
  return null;
}

/**
 * Saves fresh currency data to localStorage
 */
function writeCache(rate) {
  try {
    const payload = {
      rate: parseFloat(rate.toFixed(2)),
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return payload;
  } catch (e) {
    console.warn('[Currency] Cache write error:', e);
  }
  return null;
}

/**
 * Formats time elapsed since timestamp
 */
function formatTimeAgo(timestamp) {
  const diffMs = Date.now() - timestamp;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Fetch with timeout using AbortController
 */
async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: 'no-cache' });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * Fetches real-time rate from API with secondary fallback
 */
async function fetchRuntimeRate() {
  // Try primary API
  try {
    const json = await fetchWithTimeout(PRIMARY_API, FETCH_TIMEOUT_MS);
    if (json && json.rates && typeof json.rates.INR === 'number') {
      return json.rates.INR;
    }
  } catch (err) {
    console.warn('[Currency] Primary API failed, trying fallback:', err.message);
  }

  // Try fallback API
  try {
    const json2 = await fetchWithTimeout(FALLBACK_API, FETCH_TIMEOUT_MS);
    if (json2 && json2.rates && typeof json2.rates.INR === 'number') {
      return json2.rates.INR;
    }
  } catch (err2) {
    console.warn('[Currency] Fallback API failed:', err2.message);
  }

  return null;
}

/**
 * Main public getter: returns live or cached exchange rate
 */
export async function getLiveCurrency() {
  const cached = readCache();
  const isCacheFresh = cached && (Date.now() - cached.timestamp < CACHE_TTL_MS);

  // If cache is fresh, use it immediately
  if (isCacheFresh) {
    currentRateData = {
      rate: cached.rate,
      status: 'LIVE',
      updatedText: 'Live',
      isLive: true
    };
    return currentRateData;
  }

  // Otherwise, attempt fresh fetch
  try {
    const liveRate = await fetchRuntimeRate();
    if (typeof liveRate === 'number' && liveRate > 0) {
      const saved = writeCache(liveRate);
      currentRateData = {
        rate: saved.rate,
        status: 'LIVE',
        updatedText: 'Live',
        isLive: true
      };
      return currentRateData;
    }
  } catch (err) {
    console.error('[Currency] Fetch error:', err);
  }

  // If API failed but we have stale cache, use it gracefully
  if (cached) {
    currentRateData = {
      rate: cached.rate,
      status: 'CACHED',
      updatedText: `Updated ${formatTimeAgo(cached.timestamp)}`,
      isLive: false
    };
    return currentRateData;
  }

  // Both API and cache unavailable
  currentRateData = {
    rate: null,
    status: 'UNAVAILABLE',
    updatedText: 'Exchange rate temporarily unavailable',
    isLive: false
  };
  return currentRateData;
}

/**
 * Synchronous getter for calculator / other modules (returns current rate or cached fallback or null)
 */
export function getCurrentSarRate() {
  if (currentRateData && typeof currentRateData.rate === 'number') {
    return currentRateData.rate;
  }
  const cached = readCache();
  return cached ? cached.rate : null;
}

/**
 * Initializes and renders the currency widget into the target container.
 * Completely non-blocking. Never throws. Uses clean SVGs, NO emoji.
 */
export function initCurrencyTicker(containerId = 'currencyTicker') {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Immediate optimistic render from cache to eliminate FOUC / layout shift
  const cached = readCache();
  if (cached) {
    renderTickerUI(container, {
      rate: cached.rate,
      status: 'CACHED',
      updatedText: `Updated ${formatTimeAgo(cached.timestamp)}`,
      isLive: false
    });
  } else {
    // Initial loading placeholder without layout shift
    container.innerHTML = `
      <span class="currency-badge status-loading">
        <span class="currency-dot loading"></span>
        <span class="currency-label">Fetching SAR rate...</span>
      </span>
    `;
  }

  // Background non-blocking fetch
  getLiveCurrency().then(result => {
    if (result) {
      renderTickerUI(container, result);
    }
  }).catch(e => {
    console.warn('[Currency] Initialization error:', e);
  });
}

/**
 * Renders the accessible, clean SVG UI for currency status
 */
function renderTickerUI(container, data) {
  if (!container) return;

  if (data.status === 'LIVE' && data.rate) {
    container.innerHTML = `
      <span class="currency-badge status-live" title="Real-time exchange rate">
        <span class="currency-dot live" aria-hidden="true"></span>
        <span class="currency-label">1 SAR = ₹${data.rate.toFixed(2)} INR</span>
        <span class="currency-tag">Live</span>
      </span>
    `;
  } else if (data.status === 'CACHED' && data.rate) {
    container.innerHTML = `
      <span class="currency-badge status-cached" title="${data.updatedText}">
        <span class="currency-dot cached" aria-hidden="true"></span>
        <span class="currency-label">1 SAR = ₹${data.rate.toFixed(2)} INR</span>
        <span class="currency-tag">${data.updatedText}</span>
      </span>
    `;
  } else {
    container.innerHTML = `
      <span class="currency-badge status-unavailable" title="Exchange rate data currently unreachable">
        <span class="currency-dot unavailable" aria-hidden="true"></span>
        <span class="currency-label">${data.updatedText}</span>
      </span>
    `;
  }
}
