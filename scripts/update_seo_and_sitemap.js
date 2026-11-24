const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const newRoutes = [
  {
    url: '/about/',
    canonical: 'https://nooreharam.com/about/',
    title: 'About NOOR-E-HARAM | Ethical Hajj &amp; Umrah Operators India',
    pageType: 'about',
    contentCluster: 'Trust',
    status: 'active',
    lastReviewed: '2026-11-24',
    factualReviewDate: '2026-11-24',
    regulatoryReviewDate: null,
    primaryIntent: 'Company founding story since 2016, leadership under Dr. Khwaja Ibrahim A Darga, values, and ethical pilgrim mission',
    targetQueryCluster: [
      'about Noor E Haram',
      'Noor E Haram Hubli director',
      'Noor E Haram history',
      'ethical Umrah operator India'
    ],
    internalLinkParent: '/',
    internalLinkChildren: ['/trust/', '/packages/', '/branches/']
  },
  {
    url: '/branches/',
    canonical: 'https://nooreharam.com/branches/',
    title: 'Branch Offices &amp; Locations Across India | NOOR-E-HARAM',
    pageType: 'hub',
    contentCluster: 'Local',
    status: 'active',
    lastReviewed: '2026-11-24',
    factualReviewDate: '2026-11-24',
    regulatoryReviewDate: null,
    primaryIntent: 'Physical branch addresses, office hours, phone numbers, and Google Maps directions for Hubli and Karnataka regional desks',
    targetQueryCluster: [
      'Noor E Haram office address',
      'Noor E Haram Hubli branch',
      'Noor E Haram Karnataka offices'
    ],
    internalLinkParent: '/',
    internalLinkChildren: ['/contact/', '/cities/north-karnataka/']
  },
  {
    url: '/contact/',
    canonical: 'https://nooreharam.com/contact/',
    title: 'Contact NOOR-E-HARAM | 24/7 Pilgrim Support &amp; Bookings',
    pageType: 'contact',
    contentCluster: 'Core',
    status: 'active',
    lastReviewed: '2026-11-24',
    factualReviewDate: '2026-11-24',
    regulatoryReviewDate: null,
    primaryIntent: 'Direct communication channels, verified helpline +91 99869 25592, official email info@nooreharam.com, and quick inquiry form',
    targetQueryCluster: [
      'Noor E Haram phone number',
      'Noor E Haram contact',
      'Noor E Haram WhatsApp helpline'
    ],
    internalLinkParent: '/',
    internalLinkChildren: ['/branches/', '/faq/']
  },
  {
    url: '/faq/',
    canonical: 'https://nooreharam.com/faq/',
    title: 'Frequently Asked Questions (FAQ) | NOOR-E-HARAM',
    pageType: 'faq',
    contentCluster: 'Guides',
    status: 'active',
    lastReviewed: '2026-11-24',
    factualReviewDate: '2026-11-24',
    regulatoryReviewDate: null,
    primaryIntent: 'Comprehensive pilgrim Q&A covering booking steps, visa rules, flight policies, hotel walking distances, and wheelchair assistance',
    targetQueryCluster: [
      'Umrah FAQ India',
      'Umrah questions answers',
      'Umrah rules for women FAQ'
    ],
    internalLinkParent: '/',
    internalLinkChildren: ['/guides/', '/guides/umrah-guide/', '/guides/umrah-masail-faq/']
  },
  {
    url: '/privacy-policy/',
    canonical: 'https://nooreharam.com/privacy-policy/',
    title: 'Privacy Policy | NOOR-E-HARAM',
    pageType: 'legal',
    contentCluster: 'Legal',
    status: 'active',
    lastReviewed: '2026-11-24',
    factualReviewDate: '2026-11-24',
    regulatoryReviewDate: null,
    primaryIntent: 'Data protection practices aligned with India DPDP Act 2023, data categories, Saudi authority sharing, and grievance officer contact',
    targetQueryCluster: [
      'Noor E Haram privacy policy',
      'pilgrim data privacy'
    ],
    internalLinkParent: '/',
    internalLinkChildren: ['/terms-and-conditions/', '/trust/']
  },
  {
    url: '/terms-and-conditions/',
    canonical: 'https://nooreharam.com/terms-and-conditions/',
    title: 'Terms and Conditions | NOOR-E-HARAM',
    pageType: 'legal',
    contentCluster: 'Legal',
    status: 'active',
    lastReviewed: '2026-11-24',
    factualReviewDate: '2026-11-24',
    regulatoryReviewDate: null,
    primaryIntent: 'Pilgrim contractual terms, fixed quote policy, flight schedule rules, and Saudi hospitality guidelines',
    targetQueryCluster: [
      'Noor E Haram terms and conditions',
      'Umrah tour booking agreement'
    ],
    internalLinkParent: '/',
    internalLinkChildren: ['/payment-policy/', '/refund-and-cancellation-policy/']
  },
  {
    url: '/refund-and-cancellation-policy/',
    canonical: 'https://nooreharam.com/refund-and-cancellation-policy/',
    title: 'Refund and Cancellation Policy | NOOR-E-HARAM',
    pageType: 'legal',
    contentCluster: 'Legal',
    status: 'active',
    lastReviewed: '2026-11-24',
    factualReviewDate: '2026-11-24',
    regulatoryReviewDate: null,
    primaryIntent: 'Clear deduction slabs based on days before departure, non-refundable components, and refund processing timelines',
    targetQueryCluster: [
      'Umrah refund policy',
      'Hajj package cancellation charges India'
    ],
    internalLinkParent: '/',
    internalLinkChildren: ['/payment-policy/', '/trust/']
  },
  {
    url: '/payment-policy/',
    canonical: 'https://nooreharam.com/payment-policy/',
    title: 'Payment Policy | NOOR-E-HARAM',
    pageType: 'legal',
    contentCluster: 'Legal',
    status: 'active',
    lastReviewed: '2026-11-24',
    factualReviewDate: '2026-11-24',
    regulatoryReviewDate: null,
    primaryIntent: 'Two-stage payment milestones (50% booking / 50% 7-10 days prior), official company bank details, scam prevention, and receipt guarantee',
    targetQueryCluster: [
      'Noor E Haram bank account details',
      'Umrah payment schedule'
    ],
    internalLinkParent: '/',
    internalLinkChildren: ['/refund-and-cancellation-policy/', '/trust/']
  }
];

// 1. Update sitemap.xml
const sitemapPath = path.join(rootDir, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');

newRoutes.forEach(r => {
  if (!sitemap.includes(`<loc>${r.canonical}</loc>`)) {
    const entry = `  <url>
    <loc>${r.canonical}</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    sitemap = sitemap.replace('</urlset>', entry + '</urlset>');
  }
});
fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log('✅ sitemap.xml updated with all 8 new routes.');

// 2. Update seo/seo-map.json
const seoMapPath = path.join(rootDir, 'seo', 'seo-map.json');
const seoMap = JSON.parse(fs.readFileSync(seoMapPath, 'utf8'));

newRoutes.forEach(r => {
  if (!seoMap.routes.some(existing => existing.url === r.url)) {
    seoMap.routes.push(r);
  }
});

seoMap.meta.version = '6.0.0';
seoMap.meta.lastUpdated = '2026-11-24';
seoMap.meta.totalCanonicalUrls = seoMap.routes.length;

fs.writeFileSync(seoMapPath, JSON.stringify(seoMap, null, 2), 'utf8');
console.log(`✅ seo/seo-map.json updated. Total canonical routes: ${seoMap.routes.length}`);

// 3. Update service-worker.js
const swPath = path.join(rootDir, 'service-worker.js');
let sw = fs.readFileSync(swPath, 'utf8');
sw = sw.replace(/nh-cache-v[0-9]+/g, 'nh-cache-v18');

newRoutes.forEach(r => {
  const rel1 = `'.${r.url}',`;
  const rel2 = `'.${r.url}index.html',`;
  if (!sw.includes(rel1)) {
    sw = sw.replace("'./tools/index.html',", `'./tools/index.html',\n  ${rel1}\n  ${rel2}`);
  }
});
fs.writeFileSync(swPath, sw, 'utf8');
console.log('✅ service-worker.js updated to nh-cache-v18 with new pages.');

// 4. Update tests/validate_all.js
const testPath = path.join(rootDir, 'tests', 'validate_all.js');
let testCode = fs.readFileSync(testPath, 'utf8');

newRoutes.forEach(r => {
  if (!testCode.includes(`'${r.url}',`)) {
    testCode = testCode.replace("'/departures/',", `'${r.url}',\n  '/departures/',`);
  }
});

testCode = testCode.replace(/sitemapUrls\.length !== [0-9]+/g, `sitemapUrls.length !== ${seoMap.routes.length}`);
testCode = testCode.replace(/Expected [0-9]+ URLs in sitemap\.xml/g, `Expected ${seoMap.routes.length} URLs in sitemap.xml`);
testCode = testCode.replace(/seoMap\.routes\.length !== [0-9]+/g, `seoMap.routes.length !== ${seoMap.routes.length}`);
testCode = testCode.replace(/seo\/seo-map\.json must contain [0-9]+ routes/g, `seo/seo-map.json must contain ${seoMap.routes.length} routes`);

fs.writeFileSync(testPath, testCode, 'utf8');
console.log(`✅ tests/validate_all.js updated for ${seoMap.routes.length} routes.`);
