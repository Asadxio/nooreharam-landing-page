const fs = require('fs');
const path = require('path');

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

console.log(`Known canonical routes:\n${Array.from(knownUrls).filter(u => u.startsWith('/')).map(u => '  • ' + u).join('\n')}\n`);

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

  // Collect internal links
  const linkRegex = /<a[^>]+href=["']([^"']+)["']/gi;
  let lMatch;
  while ((lMatch = linkRegex.exec(content)) !== null) {
    const href = lMatch[1].trim();
    if (href.startsWith('/') && !href.startsWith('//')) {
      allInternalHrefs.push({ from: relPath, to: href });
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
  });
}

// 3. Validate robots.txt
console.log('\nChecking robots.txt...');
if (!fs.existsSync('robots.txt')) {
  console.error('❌ robots.txt not found!');
  totalErrors++;
} else {
  const robots = fs.readFileSync('robots.txt', 'utf8');
  if (!robots.includes('Sitemap:')) {
    console.error('  ❌ robots.txt missing Sitemap directive!');
    totalErrors++;
  } else {
    console.log('  ✓ robots.txt contains valid Sitemap reference.');
  }
}

console.log(`\n=== QA SUMMARY ===`);
if (totalErrors === 0) {
  console.log('🎉 ALL AUDITS PASSED WITH 0 ERRORS!');
  process.exit(0);
} else {
  console.error(`❌ Total failures found: ${totalErrors}`);
  process.exit(1);
}
