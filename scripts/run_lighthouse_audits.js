const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Simple static server
const PORT = 8098;
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
  console.log(`Local server listening on http://localhost:${PORT}`);

  const targets = [
    { name: 'Home', path: '/' },
    { name: 'Packages', path: '/packages/' },
    { name: 'FAQ', path: '/faq/' },
    { name: 'Contact', path: '/contact/' }
  ];

  const results = {};

  try {
    for (const target of targets) {
      const url = `http://localhost:${PORT}${target.path}`;
      const outFile = `lh_${target.name.toLowerCase()}.json`;
      console.log(`Running Lighthouse on ${target.name} (${url})...`);
      
      const cmd = `npx lighthouse ${url} --chrome-flags="--headless --no-sandbox --disable-gpu" --form-factor=mobile --output=json --output-path=${outFile} --only-categories=performance,accessibility,best-practices,seo --quiet`;
      execSync(cmd, { stdio: 'inherit' });

      if (fs.existsSync(outFile)) {
        const raw = fs.readFileSync(outFile, 'utf8');
        const data = JSON.parse(raw);
        results[target.name] = {
          performance: Math.round(data.categories.performance.score * 100),
          accessibility: Math.round(data.categories.accessibility.score * 100),
          bestPractices: Math.round(data.categories['best-practices'].score * 100),
          seo: Math.round(data.categories.seo.score * 100)
        };
        console.log(`Scores for ${target.name}:`, results[target.name]);
        fs.unlinkSync(outFile);
      }
    }

    console.log('\n=== FINAL LIGHTHOUSE MOBILE RESULTS ===');
    console.table(results);
    fs.writeFileSync('lighthouse_results.json', JSON.stringify(results, null, 2), 'utf8');
  } catch (err) {
    console.error('Error running lighthouse:', err.message);
  } finally {
    server.close();
  }
});
