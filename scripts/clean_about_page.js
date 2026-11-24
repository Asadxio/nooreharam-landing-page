const fs = require('fs');

const cleanAboutStory = `<h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:#06281e;margin-bottom:16px;">Our Founding Story</h2>
        <p style="color:#334155;line-height:1.8;font-size:1.02rem;">
          <strong>NOOR-E-HARAM</strong> was established in Hubli, Karnataka, with a clear spiritual mandate: to eliminate the ambiguity, hidden surcharges, and exaggerated hotel claims that too often distress Indian pilgrims. Embarking on Hajj or Umrah should be the most serene and spiritually elevating journey of a believer's life—not a source of logistical anxiety.
        </p>
        <p style="color:#334155;line-height:1.8;font-size:1.02rem;">
          We founded NOOR-E-HARAM on the enduring conviction that serving the guests of Allah (Dhuyuf ar-Rahman) is not a commercial enterprise, but a sacred religious trust (Amanah). Headquartered in Hubli with departure operations serving pilgrims from Karnataka, Mumbai, and pan-India gateways, we coordinate end-to-end pilgrimage travel rooted in transparent communication.
        </p>

        <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:#06281e;margin:40px 0 16px;">Our Core Operating Values</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin:24px 0;">
          <div style="background:#f8fafc;padding:20px;border-radius:10px;border-left:4px solid #C59B27;">
            <h3 style="font-size:1.1rem;color:#06281e;margin-top:0;">1. Truth in Distance</h3>
            <p style="font-size:0.9rem;color:#475569;margin:0;">We state honest walking distances to the Haram courtyards. We do not use deceptive straight-line measurements that mislead elderly or wheelchair-dependent pilgrims.</p>
          </div>
          <div style="background:#f8fafc;padding:20px;border-radius:10px;border-left:4px solid #06281e;">
            <h3 style="font-size:1.1rem;color:#06281e;margin-top:0;">2. Scholar Accompaniment</h3>
            <p style="font-size:0.9rem;color:#475569;margin:0;">Every group is guided by experienced Islamic scholars to ensure all rituals of Ihram, Tawaf, Sa'i, and Ziyarat are performed in accordance with the Sunnah.</p>
          </div>
          <div style="background:#f8fafc;padding:20px;border-radius:10px;border-left:4px solid #166534;">
            <h3 style="font-size:1.1rem;color:#06281e;margin-top:0;">3. Fixed Price Guarantee</h3>
            <p style="font-size:0.9rem;color:#475569;margin:0;">Once confirmed in writing on your booking confirmation invoice, your package price is fixed. We never impose surprise surcharges after payment.</p>
          </div>
        </div>

        <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:#06281e;margin:40px 0 16px;">Leadership &amp; Scholar Guidance</h2>
        <p style="color:#334155;line-height:1.8;font-size:1.02rem;">
          Our tours are accompanied by qualified scholars and experienced tour managers who lead pre-departure orientation, clarify Islamic rulings (Masail), and assist elderly pilgrims throughout their stay in Makkah al-Mukarramah and Al-Madinah al-Munawwarah.
        </p>`;

let aboutText = fs.readFileSync('about/index.html', 'utf8');
const aboutRegex = /<h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:#06281e;margin-bottom:16px;">Our Founding Story<\/h2>[\s\S]*?<\/p>\s*<\/div>\s*<\/section>/i;

if (aboutRegex.test(aboutText)) {
  aboutText = aboutText.replace(aboutRegex, cleanAboutStory + '\n      </div>\n    </section>');
  // Also clean footer
  aboutText = aboutText.replace(/since 2016\./g, '.');
  aboutText = aboutText.replace(/Dr\. Khwaja Ibrahim A Darga/g, 'our leadership');
  fs.writeFileSync('about/index.html', aboutText, 'utf8');
  console.log('✅ Successfully replaced About page content without invented claims');
} else {
  console.error('❌ Could not match About story regex');
}
