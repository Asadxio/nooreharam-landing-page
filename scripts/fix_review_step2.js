const fs = require('fs');

// --- 1. MAHRAM / VISA FAQ & CONTENT ---
console.log('Updating Mahram/Visa FAQ content in index.html, faq/index.html, and build scripts...');

// index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// In schema
indexHtml = indexHtml.replace(
  `"The Saudi Ministry of Hajj and Umrah permits female pilgrims of all ages to undertake Umrah without a Mahram when traveling in an organized, verified group tour. Indian regulatory and airline procedures continue to be coordinated directly by our operations team. (Last verified: November 2026). Please confirm exact documentation with our team prior to departure."`,
  `"The Saudi Ministry of Hajj and Umrah permits female pilgrims to undertake Umrah without a Mahram when traveling in an organized, verified group tour. Rules change: confirm with our team or official Nusuk source (nusuk.sa) before booking."`
);

// In FAQ body
const oldMahramHtml = `Saudi Ministry of Hajj and Umrah permits female pilgrims of all ages to undertake Umrah without a Mahram when traveling in an organized, verified group tour. Indian regulatory and airline procedures continue to be coordinated directly by our operations team. (Last verified: November 2026). Please confirm exact documentation with our team prior to departure.`;
const newMahramHtml = `Current Saudi Ministry of Hajj and Umrah regulations permit female pilgrims to undertake Umrah without a Mahram when traveling with an organized, verified group tour. <strong>Rules change:</strong> confirm exact requirements with our team or through the official Nusuk portal (<a href="https://www.nusuk.sa" target="_blank" rel="noopener noreferrer" style="color:#C59B27;text-decoration:underline;">nusuk.sa</a>) prior to booking.`;

indexHtml = indexHtml.replace(oldMahramHtml, newMahramHtml);

// Visa processing time in index.html schema and body
indexHtml = indexHtml.replace(
  `Saudi Umrah visa processing typically takes 7–14 working days after submission of complete documents. During peak seasons like Ramadan, processing may take longer. We recommend applying at least 3–4 weeks before your intended travel date. Our team handles the entire visa process on your behalf.`,
  `Saudi Umrah electronic visa processing times are subject to Saudi Ministry approval queues, system verification, and seasonal demand. We recommend submitting your verified passport documents well in advance of your intended travel date. Our operations team manages electronic filing on your behalf.`
);

// DPDP compliance self-claim in index.html banner
indexHtml = indexHtml.replace(
  `We use essential cookies and anonymous analytics to improve your pilgrimage booking experience in compliance with India's DPDP Act 2023.`,
  `We use essential cookies and anonymous analytics to improve your pilgrimage booking experience, aligned with the Digital Personal Data Protection Act, 2023.`
);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('✅ Updated index.html Mahram FAQ, visa text, and DPDP banner');

// faq/index.html
let faqHtml = fs.readFileSync('faq/index.html', 'utf8');
faqHtml = faqHtml.replace(
  `"text": "Saudi Ministry regulations allow women to perform Umrah in an organized group without a Mahram. Last verified: November 2026."`,
  `"text": "Saudi Ministry regulations permit women to travel in authorized group tours without a Mahram. Rules change: confirm with our team or official Nusuk portal (nusuk.sa) before booking."`
);
faqHtml = faqHtml.replace(
  `Yes, current Saudi Ministry of Hajj &amp; Umrah rules permit women to travel in authorized group tours without a Mahram. (Last verified: November 2026).`,
  `Current Saudi Ministry of Hajj &amp; Umrah rules permit women to travel in authorized group tours without a Mahram. Rules change: confirm with our team or official Nusuk source (<a href="https://www.nusuk.sa" target="_blank" rel="noopener noreferrer" style="color:#06281e;font-weight:700;">nusuk.sa</a>) before booking.`
);
fs.writeFileSync('faq/index.html', faqHtml, 'utf8');
console.log('✅ Updated faq/index.html');

// --- 2. ABOUT PAGE INVENTED CLAIMS AUDIT & FIX ---
console.log('Auditing and updating about/index.html...');
let aboutHtml = fs.readFileSync('about/index.html', 'utf8');

// Replace "established 2016 in Hubli" and "Dr. Khwaja Ibrahim A Darga"
aboutHtml = aboutHtml.replace(
  `<title>About NOOR-E-HARAM | Ethical Hajj &amp; Umrah Operators India</title>
  <meta name="description" content="Discover the founding story of NOOR-E-HARAM Tours &amp; Travels (established 2016 in Hubli). Dedicated scholar leadership, honest hotel distances, and verified pilgrim service.">`,
  `<title>About NOOR-E-HARAM | Ethical Hajj &amp; Umrah Tour Operators</title>
  <meta name="description" content="Discover the founding mission of NOOR-E-HARAM Tours &amp; Travels, based in Hubli, Karnataka. Dedicated scholar guidance, honest hotel walking distances, and sincere pilgrim service.">`
);

aboutHtml = aboutHtml.replace(
  `"foundingDate": "2016",\n        "email": "info@nooreharam.com",`,
  `"email": "info@nooreharam.com",`
);

aboutHtml = aboutHtml.replace(
  `<span class="eyebrow eyebrow-gold">Established in 2016 • Hubli, Karnataka</span>`,
  `<span class="eyebrow eyebrow-gold">Founded in Hubli, Karnataka</span>`
);

const oldAboutStory = `<p style="color:#334155;line-height:1.8;font-size:1.02rem;">
          In 2016, <strong>NOOR-E-HARAM</strong> was established in Hubli, Karnataka, by Dr. Khwaja Ibrahim A Darga with a clear mission: to eliminate the deception, hidden charges, and exaggerated hotel claims that too often distress Indian pilgrims. Many families would embark on what should be the most spiritually transformative journey of their lives, only to be placed in remote hotels, stranded without guidance, or subjected to unexpected price hikes.
        </p>
        <p style="color:#334155;line-height:1.8;font-size:1.02rem;">
          We built NOOR-E-HARAM on the principle that serving pilgrims is not a transactional business, but a sacred religious trust (Amanah). Starting from North Karnataka, our operations have steadily grown to escort thousands of pilgrims from Mumbai, Bangalore, Hubli, and regional towns across India.
        </p>

        <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:#06281e;margin:40px 0 16px;">Our Core Operating Values</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin:24px 0;">
          <div style="background:#f8fafc;padding:20px;border-radius:10px;border-left:4px solid #C59B27;">
            <h3 style="font-size:1.1rem;color:#06281e;margin-top:0;">1. Truth in Distance</h3>
            <p style="font-size:0.9rem;color:#475569;margin:0;">We never exaggerate walking distances. Every meter is measured to the courtyard entrance, ensuring elderly pilgrims are never misled.</p>
          </div>
          <div style="background:#f8fafc;padding:20px;border-radius:10px;border-left:4px solid #06281e;">
            <h3 style="font-size:1.1rem;color:#06281e;margin-top:0;">2. Scholar Accompaniment</h3>
            <p style="font-size:0.9rem;color:#475569;margin:0;">Every group is guided by certified Islamic scholars fluent in Urdu, English, and Kannada to conduct rituals strictly per Sunnah.</p>
          </div>
          <div style="background:#f8fafc;padding:20px;border-radius:10px;border-left:4px solid #166534;">
            <h3 style="font-size:1.1rem;color:#06281e;margin-top:0;">3. Fixed Price Guarantee</h3>
            <p style="font-size:0.9rem;color:#475569;margin:0;">Once confirmed in writing, your quote is fixed. We do not demand unexpected surcharges at the airport or hotel desk.</p>
          </div>
        </div>

        <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:#06281e;margin:40px 0 16px;">Leadership &amp; Scholar Guidance</h2>
        <p style="color:#334155;line-height:1.8;font-size:1.02rem;">
          Our tours are led under the direct supervision of Dr. Khwaja Ibrahim A Darga alongside senior scholars. From pre-departure Manasik orientation workshops in Hubli and Bangalore to the farewell Tawaf in Makkah, our scholars are present 24/7 on the ground to answer Fiqh queries, lead group Du'as, and attend to elderly pilgrims.
        </p>`;

const newAboutStory = `<p style="color:#334155;line-height:1.8;font-size:1.02rem;">
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

        <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:#06281e;margin:40px 0 16px;">Leadership &amp; Scholar Mentorship</h2>
        <p style="color:#334155;line-height:1.8;font-size:1.02rem;">
          Our tours are accompanied by qualified scholars and experienced tour managers who lead pre-departure orientation, clarify Islamic rulings (Masail), and assist elderly pilgrims throughout their stay in Makkah al-Mukarramah and Al-Madinah al-Munawwarah.
        </p>`;

aboutHtml = aboutHtml.replace(oldAboutStory, newAboutStory);

// Footer in about
aboutHtml = aboutHtml.replace('since 2016.', '.');
fs.writeFileSync('about/index.html', aboutHtml, 'utf8');
console.log('✅ Updated about/index.html: removed invented dates and names');

// --- 3. BRANCHES PAGE INVENTED CLAIMS AUDIT & FIX ---
console.log('Auditing and updating branches/index.html...');
let branchHtml = fs.readFileSync('branches/index.html', 'utf8');

// Update Hubli card hours to "By Appointment & General Office Hours"
branchHtml = branchHtml.replace(
  `🕒 <strong>Hours:</strong> Mon – Sat: 10:00 AM – 7:00 PM`,
  `🕒 <strong>Hours:</strong> General Office Hours &amp; By Appointment ([[OFFICE_HOURS]])`
);

// Update Hangal regional desk card to show clear placeholder status
const oldRegionalCard = `<!-- Hangal & North Karnataka Desk -->
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;box-shadow:0 4px 16px rgba(0,0,0,0.05);">
            <span style="background:#f1f5f9;color:#334155;font-size:0.75rem;font-weight:700;padding:4px 10px;border-radius:999px;">REGIONAL DESK</span>
            <h2 style="font-size:1.35rem;color:#06281e;margin:12px 0 8px;">Hangal &amp; Haveri Desk</h2>
            <p style="color:#64748b;font-size:0.9rem;line-height:1.6;margin-bottom:14px;">
              Regional pilgrim assistance coordinator for Haveri, Hangal, Savanur &amp; Sirsi pilgrims.
            </p>
            <div style="font-size:0.88rem;color:#334155;margin-bottom:16px;line-height:1.6;">
              <p style="margin:4px 0;">📞 <strong>Coordinator:</strong> <a href="tel:+919986925592" style="color:#06281e;">+91 99869 25592</a></p>
              <p style="margin:4px 0;">✉️ <strong>Email:</strong> <a href="mailto:info@nooreharam.com" style="color:#06281e;">info@nooreharam.com</a></p>
              <p style="margin:4px 0;">🕒 <strong>Consultation:</strong> By Appointment</p>
            </div>
            <a href="https://wa.me/919986925592?text=Assalamu%20Alaikum%20Hangal%20Coordinator" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="width:100%;text-align:center;display:block;">
              💬 Chat with Hangal Coordinator
            </a>
          </div>`;

const newRegionalCard = `<!-- Regional Support Network -->
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

branchHtml = branchHtml.replace(oldRegionalCard, newRegionalCard);
branchHtml = branchHtml.replace('since 2016.', '.');
fs.writeFileSync('branches/index.html', branchHtml, 'utf8');
console.log('✅ Updated branches/index.html: removed invented regional desk and hours');
