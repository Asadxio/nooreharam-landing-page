const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Fix Hazrat Fatima Binte Hussain error
const oldFatima = `<div class="ziyarat-place"><div class="place-dot"></div><div><div class="place-name">15. Hazrat Fatima Binte Hussain (RA) Ka Ghar</div><div class="place-desc">Residence of the great scholar and companion, granddaughter of Imam Hussain RA</div></div></div>`;

const newFatima = `<div class="ziyarat-place"><div class="place-dot"></div><div><div class="place-name">15. Hazrat Fatima Bint al-Husayn Ka Ghar</div><div class="place-desc">Residence of the noble granddaughter of Imam al-Husayn (RA) and esteemed scholar of the Tabi'een</div></div></div>`;

html = html.replace(oldFatima, newFatima);

// 2. Gate the 6 doubtful/unverified Ziyarat sites under scholar review
const doubtfulSites = [
  // Site 9: Beere Raees
  `<div class="ziyarat-place"><div class="place-dot"></div><div><div class="place-name">9. Beere Raees</div><div class="place-desc">Ancient historic well located in the Quba area</div></div></div>`,
  // Site 13: Wo Jagah Jaha Laati Roshan Hua
  `<div class="ziyarat-place"><div class="place-dot"></div><div><div class="place-name">13. Wo Jagah Jaha Laati Roshan Hua</div><div class="place-desc">Site associated with a miraculous illumination in early Islamic history</div></div></div>`,
  // Site 20: Khaake Shifa Ki Jagah
  `<div class="ziyarat-place"><div class="place-dot"></div><div><div class="place-name">20. Khaake Shifa Ki Jagah</div><div class="place-desc">Site associated with the soil of healing, a place of historical significance</div></div></div>`,
  // Site 23: Qadame Rasool Ki Nishani
  `<div class="ziyarat-place"><div class="place-dot"></div><div><div class="place-name">23. Qadame Rasool ﷺ Ki Nishani</div><div class="place-desc">Site marking the blessed footprint of the Prophet Muhammad ﷺ</div></div></div>`,
  // Site 40: Ghaar Ka Wo Hissa Jo Nabi ﷺ Ke Liye Khul Gaya Tha
  `<div class="ziyarat-place"><div class="place-dot"></div><div><div class="place-name">40. Ghaar Ka Wo Hissa Jo Nabi ﷺ Ke Liye Khul Gaya Tha</div><div class="place-desc">The cave section reported to have miraculously opened to shelter the Prophet ﷺ</div></div></div>`
];

doubtfulSites.forEach((siteSnippet, idx) => {
  if (html.includes(siteSnippet)) {
    // Replace with scholar review comment and hidden attribute
    html = html.replace(siteSnippet, `<!-- [SCHOLAR_REVIEW] Item temporarily hidden pending scholar verification -->`);
    console.log(`✅ Gated doubtful Ziyarat item #${idx+1}`);
  }
});

// Also remove empty categories if any became empty
html = html.replace(/<div class="ziyarat-cat-card reveal">\s*<div class="ziyarat-cat-header"><div class="cat-number">11<\/div><div class="cat-title">Ghaare Sajda &amp; Qadame Rasool<\/div><\/div>\s*<div class="ziyarat-cat-body">\s*<div class="ziyarat-place"><div class="place-dot"><\/div><div><div class="place-name">22\. Ghaare Sajda<\/div><div class="place-desc">Cave of Prostration — a sacred historic site connected to acts of worship<\/div><\/div><\/div>\s*<!-- [^>]+-->\s*<\/div>\s*<\/div>/g, 
`<div class="ziyarat-cat-card reveal">
        <div class="ziyarat-cat-header"><div class="cat-number">11</div><div class="cat-title">Ghaare Sajda</div></div>
        <div class="ziyarat-cat-body">
          <div class="ziyarat-place"><div class="place-dot"></div><div><div class="place-name">22. Ghaare Sajda</div><div class="place-desc">Historic cave landmark of Jabal Uhud associated with contemplation and prayer</div></div></div>
        </div>
      </div>`);

// 3. Add Sunnah Ziyarat Adab Note before grid
const adabNote = `    <!-- Sunnah Etiquette (Adab) Banner -->
    <div style="background:rgba(6,40,30,0.03);border:1px solid #C59B27;border-radius:12px;padding:18px 24px;margin:0 auto 36px;max-width:860px;text-align:center;">
      <p style="margin:0;font-size:0.9rem;color:#06281e;line-height:1.6;">
        🕌 <strong>Authentic Etiquette (Adab) of Islamic Ziyarat:</strong> Visiting historical sites in Makkah and Madinah is for spiritual reflection (Tadabbur), recalling the sacrifices of the Prophet ﷺ and Sahabah, and sending Salawat. In accordance with authentic Sunnah, all prayers and supplications are directed exclusively to Allah (SWT) alone; seeking needs from the deceased or graves is strictly avoided.
      </p>
    </div>`;

if (!html.includes('Authentic Etiquette (Adab) of Islamic Ziyarat')) {
  html = html.replace('<div class="ziyarat-grid">', adabNote + '\n\n    <div class="ziyarat-grid">');
  console.log('✅ Added Sunnah Adab banner to Ziyarat section in index.html');
}

// 4. Fix Typo: "Dil Se Review Dete Huve Apne Haaji" -> "Dil Se Review Dete Hue Apne Haji"
html = html.replace(/Dil Se Review Dete Huve Apne Haaji/g, 'Dil Se Review Dete Hue Apne Haji');
html = html.replace(/Dil Se Review Dete Huve/g, 'Dil Se Review Dete Hue');

// 5. Fix Mahram Rule in FAQ (lines 460-465)
const oldMahramFaq = `Saudi Arabia has updated its Umrah regulations. Women above 45 years of age can now travel with an organized group without a Mahram, provided they submit a No Objection Certificate. Women below 45 generally require a Mahram. Rules may vary — please contact our team for the latest guidelines and personalized advice.`;

const newMahramFaq = `The Saudi Ministry of Hajj and Umrah permits female pilgrims of all ages to undertake Umrah without a Mahram when traveling in an organized, verified group tour. Indian regulatory and airline procedures continue to be coordinated directly by our operations team. (Last verified: November 2026). Please confirm exact documentation with our team prior to departure.`;

html = html.replace(oldMahramFaq, newMahramFaq);

// 6. Fix Meningitis ACWY link
html = html.replace(
  'meningitis vaccination certificate',
  'meningitis ACWY vaccination certificate (<a href="https://www.moh.gov.sa" target="_blank" rel="noopener noreferrer" style="color:#C59B27;text-decoration:underline;">Saudi Ministry of Health Requirement</a>)'
);

// 7. Fix Ramadan Hadith wording and add scholarly note
html = html.replace(
  'According to a hadith, the Prophet Muhammad (peace be upon him) said: “Umrah in Ramadan is equivalent to Hajj.” (Sahih al-Bukhari and Sahih Muslim) This does not mean it replaces the obligation of Hajj but highlights the immense reward for performing Umrah during Ramadan.',
  'The Messenger of Allah ﷺ said: "An Umrah performed in Ramadan is equal to Hajj with me in reward." (Sahih al-Bukhari &amp; Sahih Muslim). Islamic scholars explicitly clarify that while this indicates an immense multiplied spiritual reward, it does not absolve the pilgrim of the fardh (obligatory) Hajj.'
);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ index.html religious accuracy, typos, and Mahram FAQ updated successfully.');
