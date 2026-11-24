const fs = require('fs');

const cleanRegionalCard = `<!-- Regional Support Network -->
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;box-shadow:0 4px 16px rgba(0,0,0,0.05);">
            <span style="background:#f1f5f9;color:#334155;font-size:0.75rem;font-weight:700;padding:4px 10px;border-radius:999px;">REGIONAL ASSISTANCE</span>
            <h2 style="font-size:1.35rem;color:#06281e;margin:12px 0 8px;">North Karnataka Support</h2>
            <p style="color:#64748b;font-size:0.9rem;line-height:1.6;margin-bottom:14px;">
              Coordinated home-visit assistance and document pickup for pilgrims across Dharwad, Haveri, Hangal, and Belgaum regions.
            </p>
            <div style="font-size:0.88rem;color:#334155;margin-bottom:16px;line-height:1.6;">
              <p style="margin:4px 0;">📞 <strong>Support Line:</strong> <a href="tel:+919986925592" style="color:#06281e;">+91 99869 25592</a></p>
              <p style="margin:4px 0;">✉️ <strong>Email:</strong> <a href="mailto:info@nooreharam.com" style="color:#06281e;">info@nooreharam.com</a></p>
              <p style="margin:4px 0;">📍 <strong>Branch Addresses:</strong> To be confirmed by owner ([[BRANCH_LIST]])</p>
            </div>
            <a href="https://wa.me/919986925592?text=Assalamu%20Alaikum%20Noor-E-Haram%20Regional%20Inquiry" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="width:100%;text-align:center;display:block;">
              💬 Connect on WhatsApp Support
            </a>
          </div>`;

let branchText = fs.readFileSync('branches/index.html', 'utf8');
const regex = /<!-- Hangal & North Karnataka Desk -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i;

if (regex.test(branchText)) {
  branchText = branchText.replace(regex, cleanRegionalCard + '\n        </div>');
  branchText = branchText.replace(/since 2016\./g, '.');
  fs.writeFileSync('branches/index.html', branchText, 'utf8');
  console.log('✅ Successfully cleaned branches/index.html');
} else {
  console.error('❌ Could not match branches regex');
}
