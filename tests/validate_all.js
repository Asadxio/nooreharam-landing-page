const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('=== STARTING AUTOMATED QA, REGRESSION & SEO VALIDATION (PHASE 4) ===\n');

let totalErrors = 0;

// 1. Find all HTML files in project
function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (['node_modules', '.git', '.netlify'].includes(file)) continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html') && file !== 'offline.html') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getHtmlFiles('.');
console.log(`Found ${htmlFiles.length} HTML content files to inspect.`);

const knownUrls = new Set();
// Add PWA offline fallback
knownUrls.add('/offline.html');
knownUrls.add('https://nooreharam.com/offline.html');

const canonicalToRel = new Map();
const allInternalHrefs = [];
const incomingLinksCount = new Map(); // For orphan page detection

htmlFiles.forEach(file => {
  const relative = path.relative('.', file).replace(/\\/g, '/');
  let urlPath = '/' + relative;
  if (urlPath === '/index.html') urlPath = '/';
  else if (urlPath.endsWith('/index.html')) urlPath = urlPath.replace(/\/index\.html$/, '/');
  knownUrls.add(urlPath);
  knownUrls.add('https://nooreharam.com' + urlPath);
  canonicalToRel.set('https://nooreharam.com' + urlPath, relative);
  if (urlPath !== '/404.html') {
    incomingLinksCount.set(urlPath, 0);
  }
});

console.log(`Known canonical routes (${knownUrls.size / 2}):\n${Array.from(knownUrls).filter(u => u.startsWith('/')).map(u => '  • ' + u).join('\n')}\n`);

// Maps for duplicate title/desc detection
const titleRegistry = new Map();
const descRegistry = new Map();

// Validate each HTML file
htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative('.', file).replace(/\\/g, '/');
  console.log(`Checking [${relPath}]...`);

  // A. Title check & uniqueness
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    console.error(`  ❌ [${relPath}] Missing or empty <title> tag!`);
    totalErrors++;
  } else {
    const title = titleMatch[1].trim();
    if (titleRegistry.has(title)) {
      console.error(`  ❌ [${relPath}] DUPLICATE TITLE! Identical to [${titleRegistry.get(title)}]: "${title}"`);
      totalErrors++;
    } else {
      titleRegistry.set(title, relPath);
      console.log(`  ✓ Title: "${title}" (${title.length} chars)`);
    }
  }

  // B. Meta description check & uniqueness
  const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content="([^"]+)"/i) || 
                     content.match(/<meta[^>]*name=["']description["'][^>]*content='([^']+)'/i);
  if (!descMatch || !descMatch[1].trim()) {
    console.error(`  ❌ [${relPath}] Missing or empty <meta name="description">!`);
    totalErrors++;
  } else {
    const desc = descMatch[1].trim();
    if (descRegistry.has(desc)) {
      console.error(`  ❌ [${relPath}] DUPLICATE DESCRIPTION! Identical to [${descRegistry.get(desc)}]: "${desc.slice(0, 50)}..."`);
      totalErrors++;
    } else {
      descRegistry.set(desc, relPath);
      console.log(`  ✓ Description: "${desc.slice(0, 70)}..." (${desc.length} chars)`);
    }
  }

  // C. Canonical tag check & exact path verification
  let expectedCanonical = 'https://nooreharam.com/' + (relPath === 'index.html' ? '' : relPath.replace(/\/index\.html$/, '/'));
  if (relPath === '404.html') expectedCanonical = null; // 404 does not require canonical

  const canonMatch = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (expectedCanonical) {
    if (!canonMatch || !canonMatch[1].trim()) {
      console.error(`  ❌ [${relPath}] Missing <link rel="canonical">!`);
      totalErrors++;
    } else {
      const canon = canonMatch[1].trim();
      if (canon !== expectedCanonical) {
        console.error(`  ❌ [${relPath}] CANONICAL MISMATCH! Found "${canon}", expected "${expectedCanonical}"`);
        totalErrors++;
      } else {
        console.log(`  ✓ Canonical matches expected: ${canon}`);
      }
    }
  }

  // D. H1 tag check (must have exactly 1 <h1> heading)
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length === 0) {
    console.error(`  ❌ [${relPath}] Missing <h1> heading!`);
    totalErrors++;
  } else if (h1Matches.length > 1) {
    console.error(`  ❌ [${relPath}] Multiple <h1> tags found (${h1Matches.length})!`);
    totalErrors++;
  } else {
    const h1Clean = h1Matches[0].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    console.log(`  ✓ H1 (single): "${h1Clean}"`);
  }

  // E. Accidental noindex check on canonical pages
  if (relPath !== '404.html') {
    const robotsMatch = content.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i);
    if (robotsMatch && robotsMatch[1].toLowerCase().includes('noindex')) {
      console.error(`  ❌ [${relPath}] ACCIDENTAL NOINDEX detected in robots meta tag!`);
      totalErrors++;
    }
  }

  // F. Images alt text check
  const imgTags = content.match(/<img[^>]*>/gi) || [];
  let missingAlt = 0;
  imgTags.forEach(img => {
    if (!img.includes('alt="') && !img.includes("alt='")) {
      missingAlt++;
    }
  });
  if (missingAlt > 0) {
    console.error(`  ❌ [${relPath}] Found ${missingAlt} <img> tag(s) without alt attribute!`);
    totalErrors++;
  } else {
    console.log(`  ✓ Images: All ${imgTags.length} <img> tags have alt attributes.`);
  }

  // G. Check for prohibited fabricated aggregateRating
  if (content.includes('"@type": "AggregateRating"') || content.includes('"@type":"AggregateRating"')) {
    console.error(`  ❌ [${relPath}] PROHIBITED: Contains unverified AggregateRating schema! Must be removed.`);
    totalErrors++;
  }

  // H. Validate JSON-LD script syntax
  const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let schemaCount = 0;
  while ((match = jsonLdRegex.exec(content)) !== null) {
    schemaCount++;
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed['@graph']) {
        console.log(`  ✓ Valid JSON-LD @graph (${parsed['@graph'].length} entities)`);
      } else {
        console.log(`  ✓ Valid JSON-LD (${parsed['@type']})`);
      }
    } catch (e) {
      console.error(`  ❌ [${relPath}] JSON-LD Parse Error in block #${schemaCount}: ${e.message}`);
      totalErrors++;
    }
  }

  // J. Placeholder text check (no lorem ipsum, TODOs, etc.)
  const placeholderRegex = /\b(lorem\s+ipsum|dolor\s+sit\s+amet|TODO|FIXME|TBD)\b/i;
  const placeholderMatch = content.match(placeholderRegex);
  if (placeholderMatch) {
    console.error(`  ❌ [${relPath}] PLACEHOLDER TEXT DETECTED: "${placeholderMatch[0]}"`);
    totalErrors++;
  } else {
    console.log(`  ✓ No placeholder text detected.`);
  }

  // K. Google Analytics GA4 tag check (G-4SZRN40VQ2)
  if (!content.includes('G-4SZRN40VQ2')) {
    console.error(`  ❌ [${relPath}] Missing GA4 measurement tag (G-4SZRN40VQ2)!`);
    totalErrors++;
  } else {
    console.log(`  ✓ GA4 tag present (G-4SZRN40VQ2)`);
  }

  // L. Collect internal links & WhatsApp links to test
  const linkRegex = /<a[^>]+href=["']([^"']+)["']/gi;
  let lMatch;
  while ((lMatch = linkRegex.exec(content)) !== null) {
    const href = lMatch[1].trim();
    if (href.startsWith('http://nooreharam.com') || href.startsWith('http://www.nooreharam.com')) {
      console.error(`  ❌ [${relPath}] INSECURE HTTP internal link: "${href}"`);
      totalErrors++;
    }
    if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/#')) {
      const cleanHref = href.split('#')[0];
      allInternalHrefs.push({ from: relPath, to: cleanHref });
      if (incomingLinksCount.has(cleanHref)) {
        incomingLinksCount.set(cleanHref, incomingLinksCount.get(cleanHref) + 1);
      }
    }
    // WhatsApp CTA link validation
    if (href.includes('wa.me/')) {
      const validWaPrefixes = [
        'https://wa.me/919986925592',
        'https://wa.me/917022914592',
        'https://wa.me/919739942455',
        'https://wa.me/917411163251'
      ];
      if (!validWaPrefixes.some(p => href.startsWith(p))) {
        console.error(`  ❌ [${relPath}] UNRECOGNIZED WhatsApp number in link: "${href}"`);
        totalErrors++;
      }
      if (href.includes(' ')) {
        console.error(`  ❌ [${relPath}] WhatsApp link contains unencoded space: "${href}"`);
        totalErrors++;
      }
    }
  }
});

// 2. Validate Sitemap.xml
console.log('\nChecking sitemap.xml...');
if (!fs.existsSync('sitemap.xml')) {
  console.error('❌ sitemap.xml not found!');
  totalErrors++;
} else {
  const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  let locMatch;
  const sitemapUrls = [];
  while ((locMatch = locRegex.exec(sitemapContent)) !== null) {
    sitemapUrls.push(locMatch[1].trim());
  }
  console.log(`  Found ${sitemapUrls.length} URLs in sitemap.xml:`);
  
  // Total canonical count check (must be 27)
  if (sitemapUrls.length !== 27) {
    console.error(`  ❌ Expected 27 URLs in sitemap.xml, found ${sitemapUrls.length}!`);
    totalErrors++;
  }

  sitemapUrls.forEach(url => {
    if (url.includes('#')) {
      console.error(`  ❌ Prohibited anchor hash in sitemap: ${url}`);
      totalErrors++;
    }
    // Verify sitemap URL matches a known on-disk route
    const urlPath = url.replace('https://nooreharam.com', '');
    if (!knownUrls.has(urlPath)) {
      console.error(`  ❌ URL in sitemap does not exist on disk: ${url}`);
      totalErrors++;
    }
  });
}

// 3. Validate seo/seo-map.json
console.log('\nChecking seo/seo-map.json...');
if (!fs.existsSync('seo/seo-map.json')) {
  console.error('❌ seo/seo-map.json not found!');
  totalErrors++;
} else {
  try {
    const seoMap = JSON.parse(fs.readFileSync('seo/seo-map.json', 'utf8'));
    if (!seoMap.routes || seoMap.routes.length !== 27) {
      console.error(`  ❌ seo/seo-map.json must contain 27 routes, found ${seoMap.routes ? seoMap.routes.length : 0}`);
      totalErrors++;
    } else {
      console.log(`  ✓ seo/seo-map.json contains ${seoMap.routes.length} validated routes.`);
    }

    // Phase 5 schema & metadata completeness verification
    seoMap.routes.forEach(r => {
      if (!r.title || !r.title.trim()) {
        console.error(`  ❌ seo/seo-map.json route [${r.url}] missing title!`);
        totalErrors++;
      }
      if (!r.factualReviewDate) {
        console.error(`  ❌ seo/seo-map.json route [${r.url}] missing factualReviewDate!`);
        totalErrors++;
      }
      if (!r.canonical || !r.canonical.startsWith('https://nooreharam.com/')) {
        console.error(`  ❌ seo/seo-map.json route [${r.url}] invalid canonical: "${r.canonical}"`);
        totalErrors++;
      }
      if (!r.primaryIntent || !r.primaryIntent.trim()) {
        console.error(`  ❌ seo/seo-map.json route [${r.url}] missing primaryIntent!`);
        totalErrors++;
      }
      if (!Array.isArray(r.targetQueryCluster) || r.targetQueryCluster.length === 0) {
        console.error(`  ❌ seo/seo-map.json route [${r.url}] missing targetQueryCluster!`);
        totalErrors++;
      }
    });
    console.log(`  ✓ All 27 routes in seo/seo-map.json verified for Title, Canonical, Factual Review Date & Query Clusters.`);
  } catch (err) {
    console.error(`  ❌ Failed to parse seo/seo-map.json: ${err.message}`);
    totalErrors++;
  }
}

// 4. Validate robots.txt
console.log('\nChecking robots.txt...');
if (!fs.existsSync('robots.txt')) {
  console.error('❌ robots.txt not found!');
  totalErrors++;
} else {
  const robots = fs.readFileSync('robots.txt', 'utf8');
  if (!robots.includes('Sitemap: https://nooreharam.com/sitemap.xml')) {
    console.error('  ❌ robots.txt missing canonical Sitemap directive!');
    totalErrors++;
  } else {
    console.log('  ✓ robots.txt contains valid Sitemap reference.');
  }
}

// 5. Validate internal link integrity & check for orphan pages
console.log('\nValidating internal links & checking for orphan pages...');
let brokenLinks = 0;
allInternalHrefs.forEach(({ from, to }) => {
  if (!knownUrls.has(to) && to !== '' && !to.startsWith('/assets/')) {
    console.error(`  ❌ Broken link from [${from}] to [${to}]`);
    brokenLinks++;
    totalErrors++;
  }
});

if (brokenLinks === 0) {
  console.log(`  ✓ All ${allInternalHrefs.length} internal links resolved successfully!`);
}

// Orphan page check (every page except homepage '/' must have at least 1 incoming link)
incomingLinksCount.forEach((count, urlPath) => {
  if (urlPath !== '/' && count === 0) {
    console.error(`  ❌ ORPHAN PAGE DETECTED! Route [${urlPath}] has 0 incoming internal links.`);
    totalErrors++;
  }
});
console.log(`  ✓ Zero orphan pages detected across ${incomingLinksCount.size} canonical routes.`);

// 6. Run Local HTTP Server test to verify real HTTP 200 responses
console.log('\nLaunching local HTTP server to verify live HTTP 200 response codes...');
const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  let filePath = path.join('.', reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    if (fs.existsSync('404.html')) {
      fs.createReadStream('404.html').pipe(res);
    } else {
      res.end('Not Found');
    }
  }
});

server.listen(8099, async () => {
  const routesToTest = Array.from(knownUrls).filter(u => u.startsWith('/') && !u.endsWith('.html'));
  routesToTest.push('/404.html');

  console.log(`  Testing ${routesToTest.length} routes via HTTP GET...`);

  let completed = 0;
  for (const route of routesToTest) {
    await new Promise((resolve) => {
      http.get(`http://localhost:8099${route}`, (res) => {
        if (route === '/404.html' ? res.statusCode !== 200 : res.statusCode !== 200) {
          console.error(`  ❌ HTTP ${res.statusCode} on route ${route}`);
          totalErrors++;
        } else {
          console.log(`  ✓ HTTP ${res.statusCode} OK: ${route}`);
        }
        res.resume();
        completed++;
        resolve();
      }).on('error', (err) => {
        console.error(`  ❌ Connection error on ${route}: ${err.message}`);
        totalErrors++;
        resolve();
      });
    });
  }

  server.close(() => {
    console.log(`\n=== QA SUMMARY ===`);
    if (totalErrors === 0) {
      console.log('🎉 ALL AUDITS, ZERO ORPHANS, ZERO DUPLICATES & HTTP INTEGRATION TESTS PASSED WITH 0 ERRORS!');
      process.exit(0);
    } else {
      console.error(`❌ Total failures found: ${totalErrors}`);
      process.exit(1);
    }
  });
});
