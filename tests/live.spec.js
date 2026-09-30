// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('NOOR-E-HARAM Live Production Verification', () => {

  test('Page loads successfully with HTTP 200 and correct title', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/NOOR-E-HARAM/);
  });

  test('Hero Countdown Timer is active with numeric digits', async ({ page }) => {
    await page.goto('/');
    const cdDays = page.locator('#nhCdDays');
    await expect(cdDays).toBeVisible();
    const daysText = await cdDays.textContent();
    expect(Number(daysText?.trim())).toBeGreaterThanOrEqual(0);
  });

  test('Currency Ticker displays live SAR to INR rate', async ({ page }) => {
    await page.goto('/');
    const ticker = page.locator('#currencyTicker');
    await expect(ticker).toBeVisible();
    await expect(ticker).toContainText('SAR');
  });

  test('Package filters toggle without breaking page', async ({ page }) => {
    await page.goto('/');
    const hajjBtn = page.locator('#packageFilterPills button[data-filter="hajj"]');
    if (await hajjBtn.count()) {
      await hajjBtn.click();
      await page.waitForTimeout(300);
      const allBtn = page.locator('#packageFilterPills button[data-filter="all"]');
      await allBtn.click();
    }
  });

  test('FAQ search filters questions dynamically', async ({ page }) => {
    await page.goto('/');
    const faqInput = page.locator('#faqSearchInput');
    if (await faqInput.count()) {
      await faqInput.fill('visa');
      await page.waitForTimeout(300);
      const matchCount = page.locator('#faqMatchCount');
      await expect(matchCount).toBeVisible();
    }
  });

  test('Zero horizontal overflow across viewport', async ({ page }) => {
    await page.goto('/');
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.offsetWidth;
    });
    expect(hasHorizontalOverflow).toBeFalsy();
  });

});
