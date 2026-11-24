const fs = require('fs');
['contact/index.html', 'scripts/build_new_pages.js'].forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/<link rel="stylesheet" href="\/assets\/css\/tools\.css">/g, '<link rel="stylesheet" href="/assets/css/design-tokens.css">');
  fs.writeFileSync(file, c, 'utf8');
});
console.log('✅ Replaced tools.css with design-tokens.css in contact and build script');
