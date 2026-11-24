const fs = require('fs');

console.log('=== AUDITING TRANSLATIONS AND RTL SUPPORT ===\n');

// Import translations.js content
const content = fs.readFileSync('assets/js/config/translations.js', 'utf8');

// Quick syntax check by executing in VM
let translations;
try {
  // Strip export
  const modCode = content.replace(/export\s+const\s+translations\s*=/, 'translations =');
  const sandbox = {};
  const vm = require('vm');
  vm.createContext(sandbox);
  vm.runInContext(modCode, sandbox);
  translations = sandbox.translations;
  console.log('✓ Successfully parsed translations.js object.');
} catch (e) {
  console.error('❌ Failed to parse translations.js:', e.message);
  process.exit(1);
}

const langs = Object.keys(translations);
console.log(`Available languages: ${langs.join(', ')}`);

const enKeys = Object.keys(translations.en);
console.log(`Total keys in English (en): ${enKeys.length}`);

const translationReviewKeys = [];

langs.forEach(lang => {
  if (lang === 'en') return;
  const langKeys = Object.keys(translations[lang]);
  const missing = enKeys.filter(k => !(k in translations[lang]));
  console.log(`Language [${lang}]: ${langKeys.length} keys present. Missing: ${missing.length}`);
  if (missing.length > 0 && missing.length <= 10) {
    console.log(`  Missing in [${lang}]:`, missing);
  }

  // Scan for [[TRANSLATION_REVIEW]]
  langKeys.forEach(k => {
    const val = translations[lang][k];
    if (typeof val === 'string' && val.includes('TRANSLATION_REVIEW')) {
      translationReviewKeys.push({ lang, key: k, val });
    }
  });
});

console.log(`\nKeys flagged [[TRANSLATION_REVIEW]]: ${translationReviewKeys.length}`);
if (translationReviewKeys.length > 0) {
  translationReviewKeys.forEach(item => {
    console.log(`  [${item.lang}] ${item.key}: ${item.val}`);
  });
}

// Check RTL toggle in i18n.js
const i18nContent = fs.readFileSync('assets/js/services/i18n.js', 'utf8');
const hasRtlHandling = i18nContent.includes("dir', 'rtl'") || i18nContent.includes('dir = "rtl"') || i18nContent.includes("setAttribute('dir', 'rtl')");
console.log(`\nRTL handling present in i18n.js: ${hasRtlHandling ? '✓ YES' : '❌ NO'}`);
