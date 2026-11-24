const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

// 1. Add Written Testimonials Component
const videoSectionEnd = `        <a href="https://maps.google.com/?cid=9110780512781257798" class="btn btn-outline" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          <span>Verified on Google Maps</span>
        </a>
      </div>
    </div>
  </div>
</section>`;

const newTestimonialsBlock = `        <a href="https://maps.google.com/?cid=9110780512781257798" class="btn btn-outline" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          <span>Verified on Google Maps</span>
        </a>
      </div>

      <!-- Written Testimonials Component (Data-Driven, Ships Clean/Empty with Placeholders) -->
      <div class="written-testimonials-block" style="margin-top: 48px; border-top: 1px solid rgba(6,40,30,0.1); padding-top: 36px;">
        <div class="text-center" style="margin-bottom: 24px;">
          <h4 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.5rem; color: var(--emerald); margin-bottom: 8px;">
            Written Pilgrim Testimonials
          </h4>
          <p style="color: var(--text-mid); font-size: 0.9rem; max-width: 600px; margin: 0 auto;">
            Direct experiences from our returning Hajis. All testimonials are submitted directly by verified travelers.
          </p>
        </div>

        <div id="written-testimonials-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <!-- Empty State: Data-driven placeholder to ensure zero fake reviews -->
          <div style="background: #ffffff; border: 1.5px dashed #cbd5e1; border-radius: 12px; padding: 28px 24px; text-align: center; grid-column: 1 / -1;">
            <span style="font-size: 2rem; display: block; margin-bottom: 10px;" aria-hidden="true">📝</span>
            <strong style="color: var(--emerald); font-size: 1rem; display: block; margin-bottom: 6px;">
              Written Reviews Under Verification
            </strong>
            <p style="color: var(--text-mid); font-size: 0.88rem; margin: 0 auto; max-width: 520px; line-height: 1.6;">
              In accordance with our strict anti-fabrication policy, written reviews from recent 2026 batches are currently being collected and verified directly with traveling pilgrims.
            </p>
            <p style="color: var(--gold-dark); font-size: 0.82rem; margin-top: 12px; font-weight: 600;">
              Traveled with Noor-E-Haram recently? Send your feedback to our official WhatsApp support desk.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;

if (indexHtml.includes('<span>Verified on Google Maps</span>')) {
  indexHtml = indexHtml.replace(videoSectionEnd, newTestimonialsBlock);
  console.log('✅ Added written testimonials component to index.html');
}

// 2. Fix Form Validation, Honeypot and Consent Checkbox in index.html
const oldFormHeader = `<form id="inquiryForm" name="inquiry-form" method="POST" data-netlify="true" netlifi-honeypot="bot-field" action="/">
            <input type="hidden" name="form-name" value="inquiry-form">
            <input type="hidden" name="bot-field">`;

const newFormHeader = `<form id="inquiryForm" name="inquiry-form" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/">
            <input type="hidden" name="form-name" value="inquiry-form">
            <p style="display:none;"><label>Don't fill this out if you're human: <input name="bot-field"></label></p>`;

indexHtml = indexHtml.replace(oldFormHeader, newFormHeader);

// Update phone input with +91 pattern
indexHtml = indexHtml.replace(
  `<input type="tel" name="phone" id="inq-phone" class="form-input" placeholder="+91 XXXXX XXXXX" required aria-required="true">`,
  `<input type="tel" name="phone" id="inq-phone" class="form-input" placeholder="+91 99869 25592" pattern="^(\\+91[\\-\\s]?)?[6-9]\\d{9}$" title="Enter a valid 10-digit Indian mobile number (e.g. 9986925592 or +91 9986925592)" required aria-required="true">`
);

// Add consent checkbox before button
const oldSubmitRow = `<div id="formStatus" role="alert" aria-live="polite" class="form-status-box"></div>
            <div class="u-flex u-gap-10 u-wrap">`;

const newSubmitRow = `<div class="form-group" style="display:flex;align-items:flex-start;gap:10px;margin:14px 0 16px;">
              <input type="checkbox" id="inq-consent" name="consent" required style="margin-top:4px;" aria-required="true">
              <label for="inq-consent" style="font-size:0.83rem;color:#475569;line-height:1.4;">
                I consent to NOOR-E-HARAM contacting me regarding this inquiry in accordance with the <a href="/privacy-policy/" target="_blank" style="color:#C59B27;text-decoration:underline;">Privacy Policy</a>.
              </label>
            </div>
            <div id="formStatus" role="alert" aria-live="polite" class="form-status-box"></div>
            <div class="u-flex u-gap-10 u-wrap">`;

indexHtml = indexHtml.replace(oldSubmitRow, newSubmitRow);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('✅ Updated index.html form with honeypot, pattern validation, and consent checkbox');

// 3. Update contact/index.html form
let contactHtml = fs.readFileSync('contact/index.html', 'utf8');
contactHtml = contactHtml.replace(
  `<form id="contactPageForm" onsubmit="`,
  `<form id="contactPageForm" name="contact-page-inquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field" onsubmit="`
);

if (!contactHtml.includes('inq-consent-contact')) {
  contactHtml = contactHtml.replace(
    `<button type="submit" class="btn btn-primary" style="width:100%;padding:12px;font-weight:700;">Submit via Official WhatsApp</button>`,
    `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:16px;">
                <input type="checkbox" id="inq-consent-contact" required style="margin-top:3px;">
                <label for="inq-consent-contact" style="font-size:0.82rem;color:#475569;line-height:1.4;">
                  I consent to NOOR-E-HARAM contacting me via WhatsApp/Phone per the <a href="/privacy-policy/" target="_blank" style="color:#06281e;text-decoration:underline;font-weight:600;">Privacy Policy</a>.
                </label>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;padding:12px;font-weight:700;">Submit via Official WhatsApp</button>`
  );
}

fs.writeFileSync('contact/index.html', contactHtml, 'utf8');
console.log('✅ Updated contact/index.html form with Netlify and consent checkbox');
