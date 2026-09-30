const { chromium, devices } = require('playwright');

const TARGET_URL = process.env.BASE_URL || 'https://nooreharam.com';

async function runCiTests() {
  console.log(`Starting CI Production Tests on: ${TARGET_URL}`);
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

  // 1. Desktop Check
  console.log('Testing Desktop Chrome...');
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const resp = await desktop.goto(TARGET_URL, { waitUntil: 'networkidle' });
  if (!resp || resp.status() !== 200) {
    throw new Error(`Expected HTTP 200, got ${resp ? resp.status() : 'null'}`);
  }
  const title = await desktop.title();
  if (!title.includes('NOOR-E-HARAM')) {
    throw new Error(`Unexpected title: ${title}`);
  }
  const hasOverflow = await desktop.evaluate(() => document.documentElement.scrollWidth > document.documentElement.offsetWidth);
  if (hasOverflow) throw new Error('Horizontal overflow on Desktop!');
  console.log('  ✓ Desktop Passed!');
  await desktop.close();

  // 2. Mobile Check (Pixel 7 Emulation)
  console.log('Testing Mobile Device (Pixel 7)...');
  const mobile = await browser.newPage({ ...devices['Pixel 7'] });
  await mobile.goto(TARGET_URL, { waitUntil: 'networkidle' });
  const mobileOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.offsetWidth);
  if (mobileOverflow) throw new Error('Horizontal overflow on Mobile!');

  // Check countdown
  const cdDays = await mobile.$eval('#nhCdDays', el => el.textContent.trim());
  if (isNaN(parseInt(cdDays, 10))) throw new Error(`Invalid countdown days: ${cdDays}`);

  // Check currency ticker
  const ticker = await mobile.$eval('#currencyTicker', el => el.textContent);
  if (!ticker.includes('SAR')) throw new Error(`Currency ticker missing SAR: ${ticker}`);

  console.log('  ✓ Mobile Passed!');
  await mobile.close();

  await browser.close();
  console.log('🎉 ALL CI TESTS PASSED SUCCESSFULLY (0 FAILURES)!');
}

runCiTests().catch(err => {
  console.error('CI Test Failed:', err);
  process.exit(1);
});
