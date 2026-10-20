/**
 * NOOR-E-HARAM — AIHUT B2B Live Departures & Packages Synchronizer
 * 
 * Securely authenticates with AIHUT Partner Portal, pulls:
 * 1. 51+ Live Fixed Group Departures (dates, flights, seats, tiers)
 * 2. Makkah & Madinah Hotels with distance in meters
 * 3. Package Inclusions, Baggage Policy & Itineraries
 * 
 * Generates sanitized, customer-safe JSON for nooreharam.com
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const CONFIG = {
  loginUrl: 'https://aihutonline.com/partner/login.php',
  email: process.env.AIHUT_EMAIL || 'nooreharamindia@gmail.com',
  password: process.env.AIHUT_PASSWORD || '9739942455',
  baseUrl: 'https://aihutonline.com/partner',
  outputDir: path.join(__dirname, '..', 'data')
};

// Ensure data directory exists
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

function postRequest(urlStr, postData) {
  return new Promise((resolve, reject) => {
    const dataString = querystring.stringify(postData);
    const url = new URL(urlStr);

    const req = https.request({
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(dataString),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      const rawCookies = res.headers['set-cookie'] || [];
      const cookieStr = rawCookies.map(c => c.split(';')[0]).join('; ');
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          cookie: cookieStr,
          body
        });
      });
    });

    req.on('error', reject);
    req.write(dataString);
    req.end();
  });
}

function getRequest(urlStr, cookieStr) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const req = https.request({
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Cookie': cookieStr,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/html, */*'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runSync() {
  console.log('🔄 [1/4] Authenticating with AIHUT Partner Portal...');
  const loginRes = await postRequest(CONFIG.loginUrl, {
    email: CONFIG.email,
    password: CONFIG.password,
    remember: 'on'
  });

  if (!loginRes.cookie) {
    throw new Error('Failed to obtain session cookie from AIHUT. Login failed.');
  }

  const cookie = loginRes.cookie;
  console.log('✅ Logged in successfully. Session established.');

  console.log('🔄 [2/4] Fetching Live Departures from ajax_get_departures.php...');
  const depRes = await getRequest(`${CONFIG.baseUrl}/ajax_get_departures.php`, cookie);
  
  let rawData;
  try {
    rawData = JSON.parse(depRes.body);
  } catch (err) {
    throw new Error('AIHUT returned non-JSON response for departures: ' + depRes.body.slice(0, 300));
  }

  if (!rawData.success || !Array.isArray(rawData.departures)) {
    throw new Error('AIHUT API returned unsuccessful or empty departures.');
  }

  console.log(`✅ Received ${rawData.departures.length} live group departures across ${rawData.cities.join(', ')}.`);

  console.log('🔄 [3/4] Fetching Hotel Directories across all Tiers...');
  const tiers = ['Budget', 'Bronze', 'Silver', 'Gold'];
  const hotelsByTier = {};

  for (const tier of tiers) {
    try {
      const hotelRes = await getRequest(`${CONFIG.baseUrl}/ajax_get_display_hotels.php?tier=${tier}`, cookie);
      const parsedHotel = JSON.parse(hotelRes.body);
      if (parsedHotel.success && parsedHotel.data && parsedHotel.data[tier]) {
        hotelsByTier[tier] = {
          makkah: (parsedHotel.data[tier].makkah || []).map(h => ({
            id: h.id,
            name: h.hotel_name,
            city: 'Makkah',
            distance: h.location_details || '500-900 Mtrs',
            video: h.youtube_link || ''
          })),
          madinah: (parsedHotel.data[tier].madinah || []).map(h => ({
            id: h.id,
            name: h.hotel_name,
            city: 'Madinah',
            distance: h.location_details || '200-400 Mtrs',
            video: h.youtube_link || ''
          }))
        };
      }
    } catch (e) {
      console.warn(`Could not load hotel directory for tier ${tier}:`, e.message);
    }
  }

  console.log('🔄 [4/4] Sanitizing & structuring dataset for NOOR-E-HARAM...');

  const sanitizedDepartures = rawData.departures.map(d => {
    // Determine status badge
    let urgencyBadge = 'Available';
    let urgencyLevel = 'green';
    if (d.available_seats <= 3) {
      urgencyBadge = `Only ${d.available_seats} Seats Left!`;
      urgencyLevel = 'red';
    } else if (d.available_seats <= 10) {
      urgencyBadge = `Filling Fast (${d.available_seats} Seats)`;
      urgencyLevel = 'amber';
    } else {
      urgencyBadge = `${d.available_seats} Seats Available`;
      urgencyLevel = 'green';
    }

    return {
      pnr_id: d.pnr_id,
      pnr_code: d.pnr_code,
      departure_city: d.city_name || 'Mumbai',
      departure_code: (d.departure_city || '').match(/\(([^)]+)\)/)?.[1] || 'BOM',
      departure_date: d.departure_date,
      departure_date_formatted: d.departure_date_formatted,
      return_date: d.return_date,
      return_date_formatted: d.return_date_formatted,
      duration_days: d.number_of_days || 15,
      airline: d.flight_name || 'Saudi Airlines',
      flight_type: d.flight_type || 'Direct Flight',
      departure_flight_number: d.departure_flight_number || '',
      return_flight_number: d.return_flight_number || '',
      departure_time: d.departure_time || '',
      saudi_arrival_time: d.saudi_arrival_time || '',
      return_time: d.return_time || '',
      india_arrival_time: d.india_arrival_time || '',
      departure_sector: d.departure_sector || 'BOM-JED',
      return_sector: d.return_sector || 'JED-BOM',
      baggage_policy: d.baggage_policy || '25KG Check-in + 7KG Hand + 5L Zamzam',
      available_seats: d.available_seats,
      total_seats: d.number_of_seats || 40,
      urgency_badge: urgencyBadge,
      urgency_level: urgencyLevel,
      pricing: {
        budget: d.pricing?.budget || 81786,
        bronze: d.pricing?.bronze || 91786,
        silver: d.pricing?.silver || 101786,
        gold: d.pricing?.gold || 125786
      },
      package_name: d.package_name || '15 Days Umrah Group Tour'
    };
  });

  // Sort by departure_date ascending
  sanitizedDepartures.sort((a, b) => new Date(a.departure_date) - new Date(b.departure_date));

  const metaData = {
    last_synced: new Date().toISOString(),
    total_active_departures: sanitizedDepartures.length,
    cities: rawData.cities || ['Mumbai', 'Bengaluru', 'Delhi', 'Ahmedabad', 'Lucknow'],
    airlines: rawData.airlines || ['SaudiAirline', 'Indigo', 'AirIndia', 'Akasa', 'OmanAir'],
    tiers: ['Budget', 'Bronze', 'Silver', 'Gold'],
    price_range: {
      min: Math.min(...sanitizedDepartures.map(d => d.pricing.budget)),
      max: Math.max(...sanitizedDepartures.map(d => d.pricing.gold))
    }
  };

  // Write files
  fs.writeFileSync(path.join(CONFIG.outputDir, 'live-departures.json'), JSON.stringify(sanitizedDepartures, null, 2));
  fs.writeFileSync(path.join(CONFIG.outputDir, 'live-hotels.json'), JSON.stringify(hotelsByTier, null, 2));
  fs.writeFileSync(path.join(CONFIG.outputDir, 'sync-meta.json'), JSON.stringify(metaData, null, 2));

  console.log(`\n🎉 SYNC COMPLETED SUCCESSFULLY!`);
  console.log(`📁 Saved: ${sanitizedDepartures.length} departures to /data/live-departures.json`);
  console.log(`📁 Saved: Hotel directory to /data/live-hotels.json`);
  console.log(`📁 Saved: Sync metadata to /data/sync-meta.json`);
}

if (require.main === module) {
  runSync().catch(err => {
    console.error('❌ Sync failed:', err);
    process.exit(1);
  });
}

module.exports = { runSync };
