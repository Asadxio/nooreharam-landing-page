const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('=== STARTING AUTOMATED QA & SEO VALIDATION ===\n');

let totalErrors = 0;

// 1. Find all HTML files in project
function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '.netlify') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getHtmlFiles('.');
console.log(`Found ${htmlFiles.length} HTML files to inspect.`);

const knownUrls = new Set();
const allInternalHrefs = [];

htmlFiles.forEach(file => {
  const relative = path.relative('.', file).replace(/\\/g, '/');
  let urlPath = '/' + relative;
  if (urlPath === '/index.html') urlPath = '/';
  else if (urlPath.endsWith('/index.html')) urlPath = urlPath.replace(/\/index\.html$/, '/');
  knownUrls.add(urlPath);
  knownUrls.add('https://nooreharam.com' + urlPath);
});

console.log(`Known canonical routes (${knownUrls.size / 2}):\n${Array.from(knownUrls).filter(u => u.startsWith('/')).map(u => '  • ' + u).join('\n')}\n`);

// Validate each HTML file
htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative('.', file);
  console.log(`Checking [${relPath}]...`);

  // Title check
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    console.error(`  ❌ [${relPath}] Missing or empty <title> tag!`);
    totalErrors++;
  } else {
    console.log(`  ✓ Title: "${titleMatch[1].trim()}" (${titleMatch[1].trim().length} chars)`);
  }

  // Meta description check
  const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content="([^"]+)"/i) || content.match(/<meta[^>]*name=["']description["'][^>]*content='([^']+)'/i);
  if (!descMatch || !descMatch[1].trim()) {
    console.error(`  ❌ [${relPath}] Missing or empty <meta name="description">!`);
    totalErrors++;
  } else {
    console.log(`  ✓ Description: "${descMatch[1].trim().slice(0, 70)}..." (${descMatch[1].trim().length} chars)`);
  }

  // Canonical tag check
  const canonMatch = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (!canonMatch || !canonMatch[1].trim()) {
    console.error(`  ❌ [${relPath}] Missing <link rel="canonical">!`);
    totalErrors++;
  } else {
    console.log(`  ✓ Canonical: ${canonMatch[1].trim()}`);
  }

  // H1 tag check
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1Match || !h1Match[1].trim()) {
    console.error(`  ❌ [${relPath}] Missing <h1> heading!`);
    totalErrors++;
  } else {
    const h1Clean = h1Match[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    console.log(`  ✓ H1: "${h1Clean}"`);
  }

  // Check for prohibited fabricated aggregateRating
  if (content.includes('"@type": "AggregateRating"') || content.includes('"@type":"AggregateRating"')) {
    console.error(`  ❌ [${relPath}] PROHIBITED: Contains unverified AggregateRating schema! Must be removed.`);
    totalErrors++;
  }

  // Validate JSON-LD script syntax
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

  // Collect internal links to test
  const linkRegex = /<a[^>]+href=["']([^"']+)["']/gi;
  let lMatch;
  while ((lMatch = linkRegex.exec(content)) !== null) {
    const href = lMatch[1].trim();
    if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/#')) {
      const cleanHref = href.split('#')[0];
      allInternalHrefs.push({ from: relPath, to: cleanHref });
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
  sitemapUrls.forEach(url => {
    if (url.includes('#')) {
      console.error(`  ❌ Prohibited anchor hash in sitemap: ${url}`);
      totalErrors++;
    } else {
      console.log(`  ✓ Sitemap URL: ${url}`);
    }
    // Verify sitemap URL matches a known on-disk route
    const urlPath = url.replace('https://nooreharam.com', '');
    if (!knownUrls.has(urlPath)) {
      console.error(`  ❌ URL in sitemap does not exist on disk: ${url}`);
      totalErrors++;
    }
  });
}

// 3. Validate robots.txt
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

// 4. Validate internal link integrity
console.log('\nValidating internal links...');
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

// 5. Run Local HTTP Server test to verify real HTTP 200 responses
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
      console.log('🎉 ALL AUDITS AND HTTP INTEGRATION TESTS PASSED WITH 0 ERRORS!');
      process.exit(0);
    } else {
      console.error(`❌ Total failures found: ${totalErrors}`);
      process.exit(1);
    }
  });
});
