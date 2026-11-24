const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

if (!html.includes('design-tokens.css')) {
  html = html.replace(
    '<link rel="stylesheet" href="./assets/css/core.css">',
    '<link rel="stylesheet" href="./assets/css/design-tokens.css">\n  <link rel="stylesheet" href="./assets/css/core.css">'
  );
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('✅ Added design-tokens.css to index.html');
}
