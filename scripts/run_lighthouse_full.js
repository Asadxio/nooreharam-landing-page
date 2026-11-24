const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 8089;
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  const filePath = path.join(process.cwd(), reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}`);

  const targets = [
    { name: 'FAQ', path: '/faq/index.html' },
    { name: 'Contact', path: '/contact/index.html' },
    { name: 'Packages', path: '/packages/index.html' },
    { name: 'Home', path: '/index.html' }
  ];

  const results = {};

  for (const t of targets) {
    const url = `http://localhost:${PORT}${t.path}`;
    const outFile = `lh_${t.name.toLowerCase()}.json`;
    console.log(`Auditing ${t.name}...`);
    try {
      execSync(`npx lighthouse ${url} --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=${outFile} --only-categories=performance,accessibility,best-practices,seo --quiet`, { stdio: 'inherit' });
      if (fs.existsSync(outFile)) {
        const data = JSON.parse(fs.readFileSync(outFile, 'utf8'));
        results[t.name] = {
          performance: Math.round(data.categories.performance.score * 100),
          accessibility: Math.round(data.categories.accessibility.score * 100),
          bestPractices: Math.round(data.categories['best-practices'].score * 100),
          seo: Math.round(data.categories.seo.score * 100)
        };
        console.log(`✓ ${t.name}:`, results[t.name]);
        fs.unlinkSync(outFile);
      }
    } catch (e) {
      console.error(`Error on ${t.name}:`, e.message);
    }
  }

  console.log('\n=== COMPLETE LIGHTHOUSE MOBILE SCORES ===');
  console.table(results);
  fs.writeFileSync('lighthouse_scores.json', JSON.stringify(results, null, 2), 'utf8');
  server.close();
});
