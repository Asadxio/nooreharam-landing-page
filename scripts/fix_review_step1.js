const fs = require('fs');

// --- 1. REFUND & CANCELLATION POLICY ---
console.log('Updating refund-and-cancellation-policy/index.html...');
let refundHtml = fs.readFileSync('refund-and-cancellation-policy/index.html', 'utf8');

const oldRefundSection = `<div class="legal-box">
            <strong>Fair &amp; Transparent Policy:</strong> We understand that unforeseen medical emergencies or family circumstances may force pilgrims to cancel their travel. Because group pilgrimage packages involve non-recoverable financial commitments (group air tickets, visa fees, hotel block reservations in Saudi Arabia), cancellations are subject to the standard deduction schedule below.
          </div>

          <h2>1. Cancellation Deduction Schedule (Slabs)</h2>
          <p>The refund amount is calculated based on the date written cancellation is received at our Hubli office or via official email (<a href="mailto:info@nooreharam.com">info@nooreharam.com</a>) relative to the flight departure date:</p>

          <table class="legal-table">
            <thead>
              <tr>
                <th>Cancellation Notice Period</th>
                <th>Deduction / Retention Amount</th>
                <th>Estimated Refund Eligibility</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>45+ Days</strong> before departure</td>
                <td>Non-refundable Registration Fee (₹5,000 per person) + Visa costs (if issued)</td>
                <td>Balance advance refunded in full</td>
              </tr>
              <tr>
                <td><strong>30 to 44 Days</strong> before departure</td>
                <td>25% of total package cost + Actual visa &amp; airline issuance penalties</td>
                <td>Remaining balance refunded</td>
              </tr>
              <tr>
                <td><strong>15 to 29 Days</strong> before departure</td>
                <td>50% of total package cost (Hotel room non-refundable block retention)</td>
                <td>Remaining balance refunded</td>
              </tr>
              <tr>
                <td><strong>08 to 14 Days</strong> before departure</td>
                <td>75% of total package cost</td>
                <td>25% of package cost refunded</td>
              </tr>
              <tr>
                <td><strong>0 to 07 Days</strong> or No-Show at Airport</td>
                <td>100% of total package cost (Non-refundable)</td>
                <td>No refund available</td>
              </tr>
            </tbody>
          </table>
          <p class="fs-14 text-mid"><em>Note: If the owner's operational contract mandates specific variance, the final deduction adheres to [[CANCELLATION_SLAB]].</em></p>

          <h2>2. Strictly Non-Refundable Components</h2>
          <p>Under all circumstances, the following fees incurred on behalf of the pilgrim cannot be refunded once processed:</p>
          <ul>
            <li><strong>Saudi Ministry Visa Fees &amp; Mandatory Health Insurance:</strong> Once approved on the electronic portal, Saudi visa fees are 100% non-refundable by the Ministry.</li>
            <li><strong>Group PNR Flight Tickets:</strong> Group block airfares are issued under strict airline charter/group contracts and do not permit individual refunds.</li>
            <li><strong>Bank Transaction &amp; Processing Fees:</strong> Statutory GST, merchant interchange fees, and international remittance bank charges.</li>
          </ul>

          <h2>3. Refund Processing Timeline</h2>
          <p>Approved refunds are processed via direct NEFT/RTGS bank transfer to the pilgrim's verified bank account within <strong>14 to 21 working days</strong> following formal audit and receipt of cancellation approval. Cash refunds are strictly prohibited under anti-money laundering and income tax regulations.</p>`;

const newRefundSection = `<div class="legal-box" style="border-left: 4px solid #eab308; background: #fefce8; padding: 20px 24px; border-radius: 8px;">
            <strong style="color: #854d0e; font-size: 1.05rem;">Status: Deduction Slabs Pending Official Management Confirmation</strong>
            <p style="margin: 8px 0 0; color: #713f12; font-size: 0.95rem; line-height: 1.6;">
              Exact percentage deduction slabs based on days before departure are currently <strong>To be confirmed by management ([[CANCELLATION_SLAB]])</strong>. 
              Because third-party supplier terms (airline group charter contracts and Saudi hotel room blocks) vary by season—particularly during peak Ramadan and Winter periods—cancellation deductions for each pilgrim are strictly governed by the specific terms stated on your individual booking invoice until standardized schedule slabs are officially ratified.
            </p>
          </div>

          <h2>1. Cancellation Deduction Schedule (Slabs)</h2>
          <p>Written cancellation must be submitted to our Hubli office or via official email (<a href="mailto:info@nooreharam.com">info@nooreharam.com</a>). The table below reflects the placeholder structure pending final percentage ratification by management:</p>

          <table class="legal-table">
            <thead>
              <tr>
                <th>Cancellation Notice Window</th>
                <th>Deduction / Retention Amount</th>
                <th>Estimated Refund Eligibility</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>[[DAYS_WINDOW_1]]</strong> (e.g. 45+ days prior)</td>
                <td>[[DEDUCTION_SLAB_1 - To be confirmed by owner]]</td>
                <td>[[REFUND_ELIGIBILITY_1 - To be confirmed by owner]]</td>
              </tr>
              <tr>
                <td><strong>[[DAYS_WINDOW_2]]</strong> (e.g. 30–44 days prior)</td>
                <td>[[DEDUCTION_SLAB_2 - To be confirmed by owner]]</td>
                <td>[[REFUND_ELIGIBILITY_2 - To be confirmed by owner]]</td>
              </tr>
              <tr>
                <td><strong>[[DAYS_WINDOW_3]]</strong> (e.g. 15–29 days prior)</td>
                <td>[[DEDUCTION_SLAB_3 - To be confirmed by owner]]</td>
                <td>[[REFUND_ELIGIBILITY_3 - To be confirmed by owner]]</td>
              </tr>
              <tr>
                <td><strong>[[DAYS_WINDOW_4]]</strong> (e.g. under 14 days prior)</td>
                <td>[[DEDUCTION_SLAB_4 - To be confirmed by owner]]</td>
                <td>[[REFUND_ELIGIBILITY_4 - To be confirmed by owner]]</td>
              </tr>
              <tr>
                <td><strong>Same-Day / No-Show at Airport</strong></td>
                <td>Non-refundable (Subject to airline &amp; hotel contract forfeitures)</td>
                <td>No refund available</td>
              </tr>
            </tbody>
          </table>

          <h2>2. Non-Refundable Statutory &amp; Supplier Components</h2>
          <p>Irrespective of cancellation timing, the following direct costs incurred with third parties cannot be recovered once issued:</p>
          <ul>
            <li><strong>Saudi Ministry Visa Fees &amp; Mandatory Health Insurance:</strong> Once issued on the official Saudi portal, electronic visa fees are non-refundable per Saudi government regulations.</li>
            <li><strong>Non-Refundable Airline Group PNRs:</strong> Group booking flight tickets are governed by airline charter cancellation rules.</li>
            <li><strong>Bank &amp; Payment Gateway Charges:</strong> Transaction fees, GST, and foreign exchange conversion charges.</li>
          </ul>

          <h2>3. Refund Processing Timeline</h2>
          <p>Approved refunds are processed via NEFT/RTGS bank transfer to the pilgrim's verified bank account within the management-confirmed timeline ([[REFUND_PROCESSING_DAYS]]) following formal audit of unutilized supplier funds. Cash refunds are strictly prohibited under Indian tax and banking laws.</p>`;

if (refundHtml.includes('<h2>1. Cancellation Deduction Schedule (Slabs)</h2>')) {
  refundHtml = refundHtml.replace(oldRefundSection, newRefundSection);
  fs.writeFileSync('refund-and-cancellation-policy/index.html', refundHtml, 'utf8');
  console.log('✅ Updated refund-and-cancellation-policy/index.html with placeholder slabs and pending notice');
} else {
  console.warn('⚠️ Could not find exact slab block in refund-and-cancellation-policy/index.html');
}

// Also update scripts/build_legal_pages.js
let buildLegal = fs.readFileSync('scripts/build_legal_pages.js', 'utf8');
if (buildLegal.includes('<h2>1. Cancellation Deduction Schedule (Slabs)</h2>')) {
  buildLegal = buildLegal.replace(oldRefundSection, newRefundSection);
  fs.writeFileSync('scripts/build_legal_pages.js', buildLegal, 'utf8');
  console.log('✅ Updated scripts/build_legal_pages.js with placeholder slabs');
}
