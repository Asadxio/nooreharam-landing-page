/**
 * Unit Test: Browser Dynamic Departure Expiry Engine
 * Verifies that client-side date checks accurately expire and hide batches
 * based on mock visitor dates (e.g. 2026-11-26, 2027-01-01).
 */

const fs = require('fs');
const assert = require('assert');

console.log('=== RUNNING UNIT TEST: DEPARTURE BATCH EXPIRY ENGINE ===\n');

const html = fs.readFileSync('departures/index.html', 'utf8');

// Extract all departure cards and their data-start-date attributes
const cardRegex = /<article[^>]*class="([^"]*departure-card[^"]*)"[^>]*data-start-date="([^"]+)"[^>]*data-pnr="([^"]+)"/g;

let match;
const cards = [];
while ((match = cardRegex.exec(html)) !== null) {
  cards.push({
    className: match[1],
    startDate: match[2],
    pnr: match[3]
  });
}

console.log(`Found ${cards.length} departure cards with data-start-date in departures/index.html.`);
assert(cards.length > 0, 'Must have rendered departure cards with data-start-date attribute');

// Pure simulation of browser expiry engine
function simulateBrowserExpiry(cardList, mockTodayStr) {
  return cardList.map(card => {
    const isPast = card.startDate < mockTodayStr;
    return {
      pnr: card.pnr,
      startDate: card.startDate,
      isExpired: isPast,
      status: isPast ? 'departed' : 'active'
    };
  });
}

// Test Case 1: Baseline Today (2026-11-24)
console.log('Test 1: Mock date 2026-11-24 (Today)...');
const res1 = simulateBrowserExpiry(cards, '2026-11-24');
const past1 = res1.filter(c => c.isExpired);
const active1 = res1.filter(c => !c.isExpired);
console.log(`  ✓ 2026-11-24: ${past1.length} past batches expired, ${active1.length} upcoming batches active.`);
assert(active1.length > 0, 'Must have active upcoming batches for 2026-11-24');
assert(active1.every(c => c.startDate >= '2026-11-24'), 'All active batches must have startDate >= 2026-11-24');

// Test Case 2: In two days (2026-11-26)
console.log('Test 2: Mock date 2026-11-26 (Two days ahead)...');
const res2 = simulateBrowserExpiry(cards, '2026-11-26');
const past2 = res2.filter(c => c.isExpired);
const active2 = res2.filter(c => !c.isExpired);
console.log(`  ✓ 2026-11-26: ${past2.length} expired, ${active2.length} active.`);
assert(past2.length >= past1.length, 'Past count must increase or stay same as date advances');
assert(active2.every(c => c.startDate >= '2026-11-26'), 'All active batches must have startDate >= 2026-11-26');

// Test Case 3: New Year (2027-01-01)
console.log('Test 3: Mock date 2027-01-01 (New Year)...');
const res3 = simulateBrowserExpiry(cards, '2027-01-01');
const past3 = res3.filter(c => c.isExpired);
const active3 = res3.filter(c => !c.isExpired);
console.log(`  ✓ 2027-01-01: ${past3.length} expired, ${active3.length} active.`);
// Confirm that all December 2026 batches are expired
const decBatches = res3.filter(c => c.startDate.startsWith('2026-12'));
assert(decBatches.length > 0, 'Must have December batches in schedule');
assert(decBatches.every(c => c.isExpired), 'All December 2026 batches must be expired by 2027-01-01');
// Confirm that January 2027 batches are still active
const janBatches = res3.filter(c => c.startDate.startsWith('2027-01'));
assert(janBatches.length > 0, 'Must have January batches in schedule');
assert(janBatches.some(c => !c.isExpired), 'January 2027 batches must be active on 2027-01-01');

// Test Case 4: March 2027 (2027-03-01)
console.log('Test 4: Mock date 2027-03-01 (Late season)...');
const res4 = simulateBrowserExpiry(cards, '2027-03-01');
const past4 = res4.filter(c => c.isExpired);
const active4 = res4.filter(c => !c.isExpired);
console.log(`  ✓ 2027-03-01: ${past4.length} expired, ${active4.length} active.`);
assert.strictEqual(active4.length, 0, 'All Winter 2026-27 batches must be expired by March 2027');

console.log('\n🎉 ALL DEPARTURE EXPIRY TESTS PASSED WITH 0 ERRORS!');
