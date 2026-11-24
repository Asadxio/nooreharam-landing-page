const fs = require('fs');

// 1. Fix Accessibility color-contrast for .nav-card-arrow in design-tokens.css
let tokens = fs.readFileSync('assets/css/design-tokens.css', 'utf8');
if (!tokens.includes('.nav-card-arrow')) {
  tokens += `\n\n/* ── ACCESSIBILITY HIGH CONTRAST FIXES ── */\n.nav-card-arrow {\n  color: #06281e !important;\n  font-weight: 700 !important;\n}\n`;
  fs.writeFileSync('assets/css/design-tokens.css', tokens, 'utf8');
  console.log('✅ Added high contrast rule for .nav-card-arrow in design-tokens.css');
}

// 2. Fix print.css and tools.css render blocking in index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(
  '<link rel="stylesheet" href="./assets/css/print.css">',
  '<link rel="stylesheet" href="./assets/css/print.css" media="print">'
);

indexHtml = indexHtml.replace(
  '<link rel="stylesheet" href="./assets/css/tools.css">',
  '<link rel="stylesheet" href="./assets/css/tools.css" media="print" onload="this.media=\'all\'">'
);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('✅ Optimized index.html CSS loading (print.css & deferred tools.css)');

// 3. Link design-tokens.css in packages/index.html if missing
let pkgHtml = fs.readFileSync('packages/index.html', 'utf8');
if (!pkgHtml.includes('design-tokens.css')) {
  pkgHtml = pkgHtml.replace(
    '<link rel="stylesheet" href="/assets/css/style.css">',
    '<link rel="stylesheet" href="/assets/css/design-tokens.css">\n  <link rel="stylesheet" href="/assets/css/style.css">'
  );
  fs.writeFileSync('packages/index.html', pkgHtml, 'utf8');
  console.log('✅ Linked design-tokens.css in packages/index.html');
}
