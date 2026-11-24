const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Resolve pricing contradiction
const oldContradiction = `Prices shown are indicative. INR prices from NOOR-E-HARAM are final. Actual pricing may vary by travel date, group size and season.`;
const newStatement = `Starting prices based on quad sharing. Your final quote is fixed in writing at booking confirmation and will not change after payment.`;

html = html.replace(oldContradiction, newStatement);

// 2. Add Inclusions/Exclusions Table in Calculator or Packages section
const inclusionsExclusionsTable = `
    <!-- Comprehensive Inclusions & Exclusions Breakdown Table -->
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px 28px;margin-top:24px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      <h3 style="font-size:1.05rem;color:#06281e;margin:0 0 16px;text-align:center;">Transparent Package Inclusions &amp; Exclusions</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;">
          <h4 style="color:#166534;font-size:0.95rem;margin:0 0 10px;display:flex;align-items:center;gap:6px;">
            <span>✓</span> What Is Always Included:
          </h4>
          <ul style="padding-left:18px;margin:0;font-size:0.85rem;color:#166534;line-height:1.6;">
            <li>Return international flights (confirmed airline PNR)</li>
            <li>Saudi electronic Umrah visa &amp; mandatory medical insurance</li>
            <li>Hotel stay in Makkah &amp; Madinah (specified walking distance)</li>
            <li>Daily 3-time Indian buffet catering (Breakfast, Lunch, Dinner)</li>
            <li>Complete AC luxury coach transfers between Jeddah, Makkah &amp; Madinah</li>
            <li>41 guided historical Ziyarat landmarks with Islamic scholar escort</li>
            <li>Complimentary 5-Litre Zamzam water can per pilgrim (airline permitting)</li>
            <li>24/7 dedicated local on-ground support staff in the Haramain</li>
          </ul>
        </div>
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;">
          <h4 style="color:#991b1b;font-size:0.95rem;margin:0 0 10px;display:flex;align-items:center;gap:6px;">
            <span>✕</span> What Is Excluded (Clear &amp; Upfront):
          </h4>
          <ul style="padding-left:18px;margin:0;font-size:0.85rem;color:#991b1b;line-height:1.6;">
            <li>Airline excess baggage charges beyond the ticket allowance</li>
            <li>Personal expenses, laundry, and local mobile SIM cards (STC/Mobily)</li>
            <li>Room service, special food orders outside the scheduled buffet</li>
            <li>Wheelchair hiring charges &amp; private porter tips at airports/hotels</li>
            <li>Internal transfers outside the scheduled group Ziyarat itinerary</li>
            <li>Any unexpected statutory tax or visa fee increases enacted by Saudi MOFA</li>
          </ul>
        </div>
      </div>
    </div>
`;

if (!html.includes('Transparent Package Inclusions &amp; Exclusions')) {
  html = html.replace('</div>\n    </div>\n  </div>\n</section>\n\n<!-- ── FREE PILGRIM DIGITAL UTILITIES SECTION ── -->', 
    inclusionsExclusionsTable + '\n    </div>\n    </div>\n  </div>\n</section>\n\n<!-- ── FREE PILGRIM DIGITAL UTILITIES SECTION ── -->');
  html = html.replace('</div>\r\n    </div>\r\n  </div>\r\n</section>\r\n\r\n<!-- ── FREE PILGRIM DIGITAL UTILITIES SECTION ── -->', 
    inclusionsExclusionsTable + '\r\n    </div>\r\n    </div>\r\n  </div>\r\n</section>\r\n\r\n<!-- ── FREE PILGRIM DIGITAL UTILITIES SECTION ── -->');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ Section 3 pricing transparency and inclusions table added to index.html');
