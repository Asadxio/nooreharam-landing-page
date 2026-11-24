const fs = require('fs');
let code = fs.readFileSync('scripts/build_new_pages.js', 'utf8');

// Replace 2016 and Dr. Khwaja in scripts/build_new_pages.js
code = code.replace(/Dr\. Khwaja Ibrahim A Darga/g, 'our founding leadership');
code = code.replace(/established 2016 in Hubli/g, 'established in Hubli, Karnataka');
code = code.replace(/"foundingDate": "2016",\n\s*/g, '');
code = code.replace(/Established in 2016 • Hubli, Karnataka/g, 'Founded in Hubli, Karnataka');
code = code.replace(/since 2016\./g, '.');
code = code.replace(/since 2016/g, '');
code = code.replace(/Last verified: November 2026/g, 'Rules change: confirm with our team / official Nusuk source before booking');
code = code.replace(/Mon – Sat: 10:00 AM – 7:00 PM/g, 'General Office Hours & By Appointment ([[OFFICE_HOURS]])');

fs.writeFileSync('scripts/build_new_pages.js', code, 'utf8');
console.log('✅ Updated scripts/build_new_pages.js to align with audited content');
