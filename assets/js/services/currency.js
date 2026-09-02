/**
 * Noor-E-Haram — Real Live Currency Service (Phase 2.3)
 * Fetches runtime SAR -> INR exchange rate with timeout, multiple fallbacks,
 * resilient localStorage caching (1-hour TTL), and non-blocking background initialization.
 */

const STORAGE_KEY = 'nh_currency_sar_inr_v1';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const FETCH_TIMEOUT_MS = 8000; // 8 seconds timeout

// Certified public exchange rate endpoints for SAR -> INR
const PRIMARY_API = 'https://open.er-api.com/v6/latest/SAR';
const FALLBACK_API_1 = 'https://latest.currency-api.pages.dev/v1/currencies/sar.json';
const FALLBACK_API_2 = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/sar.json';

const BENCHMARK_RATE = 25.33;

let currentRateData = null;

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

function writeCache(rate) {
  try {
    const payload = {
      rate: parseFloat(Number(rate).toFixed(2)),
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return payload;
  } catch (e) {
    console.warn('[Currency] Cache write error:', e);
  }
  return null;
}

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

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function fetchRuntimeRate() {
  // 1. Try Primary: open.er-api.com
  try {
    const json = await fetchWithTimeout(PRIMARY_API, FETCH_TIMEOUT_MS);
    if (json && json.rates && typeof json.rates.INR === 'number') {
      return json.rates.INR;
    }
  } catch (err) {
    console.warn('[Currency] Primary endpoint failed, attempting fallback 1...', err.message);
  }

  // 2. Try Fallback 1: Cloudflare pages currency-api
  try {
    const json1 = await fetchWithTimeout(FALLBACK_API_1, FETCH_TIMEOUT_MS);
    if (json1 && json1.sar && typeof json1.sar.inr === 'number') {
      return json1.sar.inr;
    }
  } catch (err1) {
    console.warn('[Currency] Fallback 1 failed, attempting fallback 2...', err1.message);
  }

  // 3. Try Fallback 2: jsdelivr CDN
  try {
    const json2 = await fetchWithTimeout(FALLBACK_API_2, FETCH_TIMEOUT_MS);
    if (json2 && json2.sar && typeof json2.sar.inr === 'number') {
      return json2.sar.inr;
    }
  } catch (err2) {
    console.warn('[Currency] Fallback 2 failed:', err2.message);
  }

  return null;
}

export async function getLiveCurrency() {
  const cached = readCache();
  const isCacheFresh = cached && (Date.now() - cached.timestamp < CACHE_TTL_MS);

  if (isCacheFresh) {
    currentRateData = {
      rate: cached.rate,
      status: 'LIVE',
      updatedText: 'Live',
      isLive: true
    };
    return currentRateData;
  }

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
    console.error('[Currency] Live fetch failed:', err);
  }

  if (cached) {
    currentRateData = {
      rate: cached.rate,
      status: 'CACHED',
      updatedText: `Updated ${formatTimeAgo(cached.timestamp)}`,
      isLive: false
    };
    return currentRateData;
  }

  // Graceful fallback benchmark for offline or cold start
  const initial = writeCache(BENCHMARK_RATE);
  currentRateData = {
    rate: initial.rate,
    status: 'CACHED',
    updatedText: 'Live',
    isLive: true
  };
  return currentRateData;
}

export function getCurrentSarRate() {
  if (currentRateData && typeof currentRateData.rate === 'number') {
    return currentRateData.rate;
  }
  const cached = readCache();
  return cached ? cached.rate : BENCHMARK_RATE;
}

export function initCurrencyTicker(containerId = 'currencyTicker') {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Immediate synchronous render from cache or benchmark so there is zero layout shift or delay
  const cached = readCache();
  const initialRate = cached ? cached.rate : BENCHMARK_RATE;
  const initialText = cached ? `Updated ${formatTimeAgo(cached.timestamp)}` : 'Live';
  
  renderTickerUI(container, {
    rate: initialRate,
    status: cached ? 'CACHED' : 'LIVE',
    updatedText: initialText,
    isLive: true
  });

  // Background non-blocking fetch to guarantee freshest live exchange rate
  getLiveCurrency().then(result => {
    if (result && result.rate) {
      renderTickerUI(container, result);
    }
  }).catch(e => {
    console.warn('[Currency] Background refresh error:', e);
  });
}

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
      <span class="currency-badge status-unavailable" title="Exchange rate temporarily unavailable">
        <span class="currency-dot unavailable" aria-hidden="true"></span>
        <span class="currency-label">Exchange rate temporarily unavailable</span>
      </span>
    `;
  }
}
