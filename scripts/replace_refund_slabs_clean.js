const fs = require('fs');

const newContent = `<div class="legal-box" style="border-left: 4px solid #eab308; background: #fefce8; padding: 20px 24px; border-radius: 8px;">
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

['refund-and-cancellation-policy/index.html', 'scripts/build_legal_pages.js'].forEach(file => {
  let text = fs.readFileSync(file, 'utf8');
  // Match from <div class="legal-box"> up to <h2>4. How to Submit
  const regex = /<div class="legal-box">[\s\S]*?<h2>4\. How to Submit/i;
  if (regex.test(text)) {
    text = text.replace(regex, newContent + '\n\n          <h2>4. How to Submit');
    fs.writeFileSync(file, text, 'utf8');
    console.log(`✅ Successfully replaced refund slabs in ${file}`);
  } else {
    console.error(`❌ Regex did not match in ${file}`);
  }
});
