const fs = require('fs');
const path = require('path');

function replaceEmailInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory() && f !== 'node_modules' && f !== '.git' && f !== 'scratch' && f !== '.github') {
      replaceEmailInDir(full);
    } else if (f.endsWith('.html') || f.endsWith('.json') || f.endsWith('.js')) {
      if (f !== 'sync_aihut_offers.js') {
        let content = fs.readFileSync(full, 'utf8');
        if (content.includes('info@nooreharam.com')) {
          content = content.replace(/nooreharamindia@gmail\.com/g, 'info@nooreharam.com');
          fs.writeFileSync(full, content, 'utf8');
          console.log('✅ Replaced email in:', full);
        }
      }
    }
  }
}

replaceEmailInDir(path.join(__dirname, '..'));
console.log('Done replacing official email across public site.');
