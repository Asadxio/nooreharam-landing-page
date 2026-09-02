/**
 * Internationalization (i18n) Localization Service
 * Manages language preferences, dynamic UI translation mappings,
 * configuration-driven package card rendering, and automated JSON-LD schema hydration.
 */

import { translations } from '../config/translations.js';
import { PACKAGE_CONFIG } from '../config/packages.config.js';
import { calculateCost, updateCalculatorFields } from './forms.js';
import { getCurrentWizardStep, renderChecklist } from './wizard.js';
import { filterBranches } from './branches.js';

const RTL_LANGS = ['ur', 'ar'];
let currentLang = localStorage.getItem('nh_lang') || 'en';
if (!translations[currentLang]) currentLang = 'en';

function setLang(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('nh_lang', lang);

  // Set RTL or LTR document direction
  const isRtl = RTL_LANGS.includes(lang);
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

  // Update language selector UI labels and active state
  const labels = { en: 'EN', ur: 'اردو', ar: 'عربي', kn: 'ಕನ್ನಡ', hinglish: 'Hinglish' };
  const labelEl = document.getElementById('langLabel');
  if (labelEl) labelEl.textContent = labels[lang] || lang.toUpperCase();
  document.querySelectorAll('.lang-option').forEach(el => {
    el.classList.toggle('active', el.dataset.lang === lang);
  });

  const t = translations[lang];

  // 1. data-i18n dynamic string translation updates
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // 2. data-i18n-ph dynamic placeholder text updates
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  applyAllTranslations(t);
}

function applyAllTranslations(t) {
  function setText(selector, key, attr) {
    const el = document.querySelector(selector);
    if (!el || !t[key]) return;
    if (attr) el[attr] = t[key];
    else el.innerHTML = t[key];
  }

  // --- DYNAMIC PACKAGE CARD RENDERING (CTO Recommendation 3) ---
  try {
    renderPackageCards(t);
  } catch (err) {
    console.error('[NH i18n Error - Package rendering]:', err);
  }

  // --- DYNAMIC JSON-LD SCHEMA GENERATION (CTO Recommendation 4 & 8) ---
  try {
    updateSchema(t);
  } catch (err) {
    console.error('[NH i18n Error - Schema generation]:', err);
  }

  // NAV
  document.querySelectorAll('.nav > a[href="#about"]').forEach(e => e && t['nav.about'] && (e.textContent = t['nav.about']));
  document.querySelectorAll('.nav > a[href="#packages"]').forEach(e => e && t['nav.packages'] && (e.textContent = t['nav.packages']));
  document.querySelectorAll('.nav > a[href="#ziyarat"]').forEach(e => e && t['nav.ziyarat'] && (e.textContent = t['nav.ziyarat']));
  document.querySelectorAll('.nav > a[href="#scholar"]').forEach(e => e && t['nav.scholar'] && (e.textContent = t['nav.scholar']));
  document.querySelectorAll('.nav-item > a[href="#branches"]').forEach(e => e && t['nav.branches'] && (e.textContent = t['nav.branches']));
  document.querySelectorAll('.nav > a[href="#contact"]').forEach(e => e && t['nav.contact'] && (e.textContent = t['nav.contact']));

  // DRAWER
  const drawerLinks = document.querySelectorAll('.mobile-drawer nav a');
  const drawerMap = {
    '#about': 'drawer.about', '#packages': 'drawer.packages', '#international': 'drawer.international',
    '#ziyarat': 'drawer.ziyarat', '#scholar': 'drawer.scholar', '#preparation': 'drawer.preparation',
    '#ramadan': 'drawer.ramadan', '#women': 'drawer.women', '#team': 'drawer.team',
    '#branches': 'drawer.branches', '#faq': 'drawer.faq', '#contact': 'drawer.contact'
  };
  drawerLinks.forEach(a => {
    const key = drawerMap[a.getAttribute('href')];
    if (key && t[key]) a.textContent = t[key];
  });
  const drawerBtns = document.querySelectorAll('.mobile-drawer .btn');
  if (drawerBtns[0] && t['drawer.call']) {
    const span = drawerBtns[0].querySelector('span');
    if (span) span.textContent = 'Call ' + t['drawer.call'];
    else drawerBtns[0].textContent = 'Call ' + t['drawer.call'];
  }
  if (drawerBtns[1] && t['drawer.whatsapp']) {
    const span = drawerBtns[1].querySelector('span');
    if (span) span.textContent = 'WhatsApp ' + t['drawer.whatsapp'];
    else drawerBtns[1].textContent = 'WhatsApp ' + t['drawer.whatsapp'];
  }

  // HEADER CTA
  const hCta = document.querySelector('.header-cta.btn-consultation');
  if (hCta) hCta.textContent = t['hero.btn1'] || 'Book Consultation';

  // HERO
  const heroTagline = document.querySelector('.hero-tagline');
  if (heroTagline && t['hero.tagline']) heroTagline.textContent = t['hero.tagline'];
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && t['hero.title1']) heroTitle.innerHTML = t['hero.title1'] + ' <span class="highlight">' + t['hero.title2'] + '</span><br>' + t['hero.title3'];
  const heroSub = document.querySelector('.hero-subtitle');
  if (heroSub && t['hero.subtitle']) heroSub.textContent = t['hero.subtitle'];
  const heroBtns = document.querySelectorAll('.hero-buttons .btn');
  if (heroBtns[0] && t['hero.btn1']) heroBtns[0].textContent = t['hero.btn1'];
  if (heroBtns[1] && t['hero.btn2']) heroBtns[1].textContent = t['hero.btn2'];
  if (heroBtns[2] && t['hero.btn3']) heroBtns[2].textContent = t['hero.btn3'];
  const trustItems = document.querySelectorAll('.hero-trust-item');
  const trustData = [['hero.trust1.value','hero.trust1.label'],['hero.trust2.value','hero.trust2.label'],['hero.trust3.value','hero.trust3.label']];
  trustItems.forEach((item, i) => {
    if (!trustData[i]) return;
    const v = item.querySelector('.trust-value'), l = item.querySelector('.trust-label');
    if (v && t[trustData[i][0]]) v.textContent = t[trustData[i][0]];
    if (l && t[trustData[i][1]]) l.textContent = t[trustData[i][1]];
  });

  // STATS
  const statLabels = document.querySelectorAll('.stat-label');
  const statKeys = ['stats.1.label','stats.2.label','stats.3.label','stats.4.label','stats.5.label'];
  statLabels.forEach((el, i) => { if (statKeys[i] && t[statKeys[i]]) el.textContent = t[statKeys[i]]; });

  // ESTIMATED COST ESTIMATOR
  setText('#calcEyebrow', 'calc.eyebrow');
  setText('#calcTitle', 'calc.title');
  setText('#calcSubtitle', 'calc.subtitle');
  setText('#lblPkgType', 'calc.lblPkgType');
  setText('#lblSharing', 'calc.lblSharing');
  setText('#lblAdults', 'calc.lblAdults');
  setText('#lblKids', 'calc.lblKids');
  setText('#lblEstTotal', 'calc.lblEstTotal');
  setText('#calcNote', 'calc.note');
  setText('#calcWhatsAppBtn', 'calc.whatsappBtn');

  // Hydrate calculator dynamic select options
  updateCalculatorFields();

  const elPkgType = document.getElementById('calcPkgType');
  const elSharing = document.getElementById('calcSharing');
  if (elPkgType) {
    elPkgType.options[0].text = `${t['pkg.group.name'] || 'Group Umrah (Mumbai)'} (${t['pkg.priceFrom'] || 'Starting'} ₹68,786)`;
    elPkgType.options[1].text = `${t['pkg.couple.name'] || 'Couple Umrah'} (${t['pkg.priceFrom'] || 'Starting'} ₹1,85,786)`;
    elPkgType.options[2].text = `${t['pkg.family.name'] || 'Family Umrah'} (${t['pkg.priceFrom'] || 'Starting'} ₹3,25,786)`;
    elPkgType.options[3].text = `${t['pkg.hajj.name'] || 'Hajj 2027'} (${t['pkg.priceFrom'] || 'Starting'} ₹6,99,786)`;
    elPkgType.options[4].text = `${t['pkg.ziyarat.name'] || 'Ziyarat Package'} (${t['pkg.priceFrom'] || 'Starting'} ₹48,000)`;
  }
  if (elSharing && t['calc.sharing.quad']) {
    elSharing.options[0].text = t['calc.sharing.quad'];
    elSharing.options[1].text = t['calc.sharing.triple'];
    elSharing.options[2].text = t['calc.sharing.double'];
    elSharing.options[3].text = t['calc.sharing.single'];
  }
  if (typeof calculateCost === 'function') calculateCost();

  // ABOUT
  const aboutEyebrow = document.querySelector('#about .eyebrow');
  if (aboutEyebrow && t['about.eyebrow']) aboutEyebrow.textContent = t['about.eyebrow'];
  const aboutTitle = document.querySelector('#about .section-title');
  if (aboutTitle && t['about.title1']) aboutTitle.innerHTML = t['about.title1'] + '<br>' + t['about.title2'];
  const aboutPs = document.querySelectorAll('#about p');
  if (aboutPs[0] && t['about.p1']) aboutPs[0].textContent = t['about.p1'];
  if (aboutPs[1] && t['about.p2']) aboutPs[1].textContent = t['about.p2'];
  const badgeNum = document.querySelector('.about-badge-num');
  if (badgeNum && t['about.badge.num']) badgeNum.textContent = t['about.badge.num'];
  const badgeText = document.querySelector('.about-badge-text');
  if (badgeText && t['about.badge.text']) badgeText.innerHTML = t['about.badge.text'];
  const checkItems = document.querySelectorAll('.check-list li');
  const checkKeys = ['about.check1','about.check2','about.check3','about.check4','about.check5','about.check6'];
  checkItems.forEach((li, i) => {
    if (!checkKeys[i] || !t[checkKeys[i]]) return;
    const icon = li.querySelector('.check-icon');
    li.textContent = '';
    if (icon) li.appendChild(icon);
    li.appendChild(document.createTextNode(' ' + t[checkKeys[i]]));
  });
  const aboutBtns = document.querySelectorAll('#about .btn');
  if (aboutBtns[0] && t['about.btn1']) aboutBtns[0].textContent = t['about.btn1'];
  if (aboutBtns[1] && t['about.btn2']) aboutBtns[1].textContent = '💬 ' + t['about.btn2'];

  // SERVICES
  setText('#services .eyebrow', 'services.eyebrow');
  setText('#services .section-title', 'services.title');
  setText('#services .section-subtitle', 'services.subtitle');
  const svcCards = document.querySelectorAll('.service-name');
  const svcKeys = ['svc.1','svc.2','svc.3','svc.4','svc.5','svc.6','svc.7','svc.8','svc.9','svc.10','svc.11','svc.12','svc.13','svc.14','svc.15','svc.16'];
  svcCards.forEach((el, i) => { if (svcKeys[i] && t[svcKeys[i]]) el.textContent = t[svcKeys[i]]; });

  // REUSABLE DEFAULTS
  const pkgNote = document.querySelector('#packages > .container > div.text-center.mt-32 p');
  if (pkgNote && t['pkg.note']) pkgNote.textContent = t['pkg.note'];
  const pkgCustomBtn = document.querySelector('#packages > .container > div.text-center.mt-32 a.btn');
  if (pkgCustomBtn && t['pkg.customBtn']) pkgCustomBtn.textContent = t['pkg.customBtn'];

  // JOURNEY TIMELINE
  setText('#journey .eyebrow', 'journey.eyebrow');
  setText('#journey .section-title', 'journey.title');
  setText('#journey .section-subtitle', 'journey.subtitle');
  const steps = document.querySelectorAll('.timeline-step');
  const stepKeys = [['step.1.title','step.1.desc'],['step.2.title','step.2.desc'],['step.3.title','step.3.desc'],['step.4.title','step.4.desc'],['step.5.title','step.5.desc'],['step.6.title','step.6.desc']];
  steps.forEach((step, i) => {
    if (!stepKeys[i]) return;
    const title = step.querySelector('.step-title'), desc = step.querySelector('.step-desc');
    if (title && t[stepKeys[i][0]]) title.textContent = t[stepKeys[i][0]];
    if (desc && t[stepKeys[i][1]]) desc.textContent = t[stepKeys[i][1]];
  });

  // ZIYARAT
  setText('#ziyarat .eyebrow', 'ziyarat.eyebrow');
  setText('#ziyarat .section-title', 'ziyarat.title');
  setText('#ziyarat .section-subtitle', 'ziyarat.subtitle');
  const zBtn = document.querySelector('#ziyarat .btn');
  if (zBtn && t['ziyarat.btn']) zBtn.textContent = t['ziyarat.btn'];
  const catTitles = document.querySelectorAll('.cat-title');
  const catKeys = Array.from({length:19}, (_, i) => 'ziyarat.cat' + (i+1));
  catTitles.forEach((el, i) => { if (catKeys[i] && t[catKeys[i]]) el.textContent = t[catKeys[i]]; });

  // DUAS
  setText('.duas-section .eyebrow', 'duas.eyebrow');
  setText('.duas-section .section-title', 'duas.title');
  const duaCards = document.querySelectorAll('.dua-card');
  const duaData = [['duas.label1','duas.trans1'],['duas.label2','duas.trans2'],['duas.label3','duas.trans3']];
  duaCards.forEach((card, i) => {
    if (!duaData[i]) return;
    const label = card.querySelector('.dua-label'), trans = card.querySelector('.dua-translation');
    if (label && t[duaData[i][0]]) label.textContent = t[duaData[i][0]];
    if (trans && t[duaData[i][1]]) trans.textContent = t[duaData[i][1]];
  });

  // WIZARD & LOCATOR TRANSLATIONS
  setText('#lblLocState', 'branches.select.state');
  setText('#lblLocCity', 'branches.select.city');
  setText('#wizTitle', 'wizard.title');
  setText('#wizSubtitle', 'wizard.subtitle');
  setText('#wizStep1Label', 'wizard.step1');
  setText('#wizStep2Label', 'wizard.step2');
  setText('#wizStep3Label', 'wizard.step3');
  setText('#wizLblUmrah', 'wizard.lbl.umrah');
  setText('#wizLblHajj', 'wizard.lbl.hajj');
  setText('#wizLblIndian', 'wizard.lbl.indian');
  setText('#wizLblNri', 'wizard.lbl.nri');
  setText('#wizLblForeign', 'wizard.lbl.foreign');
  setText('#wizLblMale', 'wizard.lbl.male');
  setText('#wizLblFemaleUnder45', 'wizard.lbl.female.under45');
  setText('#wizLblFemaleOver45', 'wizard.lbl.female.over45');
  setText('#wizResultTitle', 'wizard.result.title');
  setText('#wizBtnWa', 'wizard.whatsapp');
  setText('#wizBtnCopy', 'wizard.copy');
  setText('#wizBtnPrint', 'wizard.print');
  setText('#wizBtnPrev', 'wizard.btn.prev');
  setText('#wizBtnReset', 'wizard.btn.reset');

  const btnNext = document.getElementById('wizBtnNext');
  if (btnNext) {
    const wizardStep = getCurrentWizardStep();
    btnNext.textContent = wizardStep === 4 ? (t['wizard.btn.reset'] || 'Reset') : (wizardStep === 3 ? (t['wizard.btn.generate'] || 'Generate Checklist') : (t['wizard.btn.next'] || 'Next Step'));
  }

  // Update Branch Locator dropdown values
  const stateSel = document.getElementById("stateFilter");
  if (stateSel) {
    for (let o of stateSel.options) {
      if (o.value === "all") {
        o.text = t['branches.all.states'] || "All States";
      }
    }
  }
  
  try {
    if (typeof filterBranches === 'function') filterBranches();
  } catch (err) {
    console.error('[NH i18n Error - Branches translation]:', err);
  }
  
  try {
    if (getCurrentWizardStep() === 4 && typeof renderChecklist === 'function') renderChecklist();
  } catch (err) {
    console.error('[NH i18n Error - Checklist translation]:', err);
  }

  // HADITH
  setText('.hadith-card:first-of-type ~ .hadith-card .hadith-translation, .hadith-card .hadith-translation', 'hadith.trans1');
  const hadithCards = document.querySelectorAll('.hadith-card');
  if (hadithCards[0]) {
    const t1 = hadithCards[0].querySelector('.hadith-translation'), s1 = hadithCards[0].querySelector('.hadith-source');
    if (t1 && t['hadith.trans1']) t1.textContent = t['hadith.trans1'];
    if (s1 && t['hadith.source1']) s1.textContent = t['hadith.source1'];
  }
  if (hadithCards[1]) {
    const t2 = hadithCards[1].querySelector('.hadith-translation'), s2 = hadithCards[1].querySelector('.hadith-source');
    if (t2 && t['hadith.trans2']) t2.textContent = t['hadith.trans2'];
    if (s2 && t['hadith.source2']) s2.textContent = t['hadith.source2'];
  }
  const hadithEyebrow = document.querySelector('section:has(.hadith-card) .eyebrow');
  if (hadithEyebrow && t['hadith.eyebrow']) hadithEyebrow.textContent = t['hadith.eyebrow'];
  const hadithTitle = document.querySelector('section:has(.hadith-card) .section-title');
  if (hadithTitle && t['hadith.title']) hadithTitle.textContent = t['hadith.title'];

  // SCHOLAR CORNER
  setText('#scholar .eyebrow', 'scholar.eyebrow');
  setText('#scholar .section-title', 'scholar.title');
  setText('#scholar .section-subtitle', 'scholar.subtitle');
  const scholarBtn = document.querySelector('#scholar .btn');
  if (scholarBtn && t['scholar.btn']) scholarBtn.textContent = t['scholar.btn'];
  const scholCards = document.querySelectorAll('.scholar-card');
  const scholData = [
    { title:'scholar.c1.title', topics:['scholar.c1.t1','scholar.c1.t2','scholar.c1.t3','scholar.c1.t4','scholar.c1.t5','scholar.c1.t6'] },
    { title:'scholar.c2.title', topics:['scholar.c2.t1','scholar.c2.t2','scholar.c2.t3','scholar.c2.t4','scholar.c2.t5','scholar.c2.t6'] },
    { title:'scholar.c3.title', topics:['scholar.c3.t1','scholar.c3.t2','scholar.c3.t3','scholar.c3.t4','scholar.c3.t5','scholar.c3.t6'] },
    { title:'scholar.c4.title', topics:['scholar.c4.t1','scholar.c4.t2','scholar.c4.t3','scholar.c4.t4','scholar.c4.t5','scholar.c4.t6'] },
    { title:'scholar.c5.title', topics:['scholar.c5.t1','scholar.c5.t2','scholar.c5.t3','scholar.c5.t4','scholar.c5.t5','scholar.c5.t6'] },
    { title:'scholar.c6.title', topics:['scholar.c6.t1','scholar.c6.t2','scholar.c6.t3','scholar.c6.t4','scholar.c6.t5','scholar.c6.t6'] },
  ];
  scholCards.forEach((card, i) => {
    if (!scholData[i]) return;
    const h = card.querySelector('h3');
    if (h && t[scholData[i].title]) h.textContent = t[scholData[i].title];
    const items = card.querySelectorAll('.topic-list li');
    items.forEach((li, j) => { if (scholData[i].topics[j] && t[scholData[i].topics[j]]) li.textContent = t[scholData[i].topics[j]]; });
  });

  // PREPARATION CENTER
  setText('#preparation .eyebrow', 'prep.eyebrow');
  setText('#preparation .section-title', 'prep.title');
  setText('#preparation .section-subtitle', 'prep.subtitle');
  const prepBtn = document.querySelector('#preparation .btn');
  if (prepBtn && t['prep.btn']) prepBtn.textContent = t['prep.btn'];
  const prepCards = document.querySelectorAll('.prep-card');
  const prepData = [
    { title:'prep.c1.title', items:['prep.c1.t1','prep.c1.t2','prep.c1.t3','prep.c1.t4','prep.c1.t5','prep.c1.t6','prep.c1.t7','prep.c1.t8','prep.c1.t9','prep.c1.t10'] },
    { title:'prep.c2.title', items:['prep.c2.t1','prep.c2.t2','prep.c2.t3','prep.c2.t4','prep.c2.t5','prep.c2.t6','prep.c2.t7'] },
    { title:'prep.c3.title', items:['prep.c3.t1','prep.c3.t2','prep.c3.t3','prep.c3.t4','prep.c3.t5','prep.c3.t6'] },
    { title:'prep.c4.title', items:['prep.c4.t1','prep.c4.t2','prep.c4.t3','prep.c4.t4','prep.c4.t5','prep.c4.t6','prep.c4.t7'] },
    { title:'prep.c5.title', items:['prep.c5.t1','prep.c5.t2','prep.c5.t3','prep.c5.t4','prep.c5.t5','prep.c5.t6'] },
    { title:'prep.c6.title', items:['prep.c6.t1','prep.c6.t2','prep.c6.t3','prep.c6.t4','prep.c6.t5','prep.c6.t6'] },
  ];
  prepCards.forEach((card, i) => {
    if (!prepData[i]) return;
    const h = card.querySelector('h3');
    if (h && t[prepData[i].title]) { const span = h.querySelector('span'); h.textContent = ''; if (span) h.appendChild(span); h.appendChild(document.createTextNode(' ' + t[prepData[i].title])); }
    const items = card.querySelectorAll('.prep-list li');
    items.forEach((li, j) => { if (prepData[i].items[j] && t[prepData[i].items[j]]) li.textContent = t[prepData[i].items[j]]; });
  });

  // WOMEN
  setText('#women .eyebrow', 'women.eyebrow');
  setText('#women .section-title', 'women.title');
  setText('#women .section-subtitle', 'women.subtitle');
  const womenBtn = document.querySelector('#women .btn');
  if (womenBtn && t['women.btn']) womenBtn.textContent = t['women.btn'];
  const womenCards = document.querySelectorAll('.women-card');
  const womenData = [
    ['women.c1.title','women.c1.desc'],['women.c2.title','women.c2.desc'],['women.c3.title','women.c3.desc'],
    ['women.c4.title','women.c4.desc'],['women.c5.title','women.c5.desc'],['women.c6.title','women.c6.desc'],
  ];
  womenCards.forEach((card, i) => {
    if (!womenData[i]) return;
    const h = card.querySelector('h4'), p = card.querySelector('p');
    if (h && t[womenData[i][0]]) h.textContent = t[womenData[i][0]];
    if (p && t[womenData[i][1]]) p.textContent = t[womenData[i][1]];
  });

  // RAMADAN
  setText('#ramadan .eyebrow', 'ramadan.eyebrow');
  setText('#ramadan .section-title', 'ramadan.title');
  setText('#ramadan .section-subtitle', 'ramadan.subtitle');
  const ramCards = document.querySelectorAll('.ramadan-card');
  const ramData = [['ramadan.c1.title','ramadan.c1.desc'],['ramadan.c2.title','ramadan.c2.desc'],['ramadan.c3.title','ramadan.c3.desc']];
  ramCards.forEach((card, i) => {
    if (!ramData[i]) return;
    const h = card.querySelector('h3'), p = card.querySelector('p'), btn = card.querySelector('.btn');
    if (h && t[ramData[i][0]]) h.textContent = t[ramData[i][0]];
    if (p && t[ramData[i][1]]) p.textContent = t[ramData[i][1]];
    if (btn && t['ramadan.btn']) btn.textContent = t['ramadan.btn'];
  });

  // INTERNATIONAL TOURS
  setText('#international .eyebrow', 'tours.eyebrow');
  setText('#international .section-title', 'tours.title');
  setText('#international .section-subtitle', 'tours.subtitle');
  const tourCards = document.querySelectorAll('.tour-card');
  const tourData = [['tours.t1','tours.t1.sub'],['tours.t2','tours.t2.sub'],['tours.t3','tours.t3.sub'],['tours.t4','tours.t4.sub']];
  tourCards.forEach((card, i) => {
    if (!tourData[i]) return;
    const n = card.querySelector('.tour-name'), s = card.querySelector('.tour-subtitle');
    if (n && t[tourData[i][0]]) n.textContent = t[tourData[i][0]];
    if (s && t[tourData[i][1]]) s.textContent = t[tourData[i][1]];
  });
  const toursBtn = document.querySelector('#international .btn');
  if (toursBtn && t['tours.btn']) toursBtn.textContent = t['tours.btn'];

  // WHY CHOOSE
  const whySec = document.querySelector('section.section[style*="cream"]');
  if (whySec) {
    const ey = whySec.querySelector('.eyebrow'), ti = whySec.querySelector('.section-title');
    if (ey && t['why.eyebrow']) ey.textContent = t['why.eyebrow'];
    if (ti && t['why.title']) ti.textContent = t['why.title'];
    const whyCards = whySec.querySelectorAll('.why-card p');
    const whyKeys = ['why.c1','why.c2','why.c3','why.c4','why.c5','why.c6','why.c7','why.c8','why.c9','why.c10','why.c11','why.c12'];
    whyCards.forEach((el, i) => { if (whyKeys[i] && t[whyKeys[i]]) el.textContent = t[whyKeys[i]]; });
  }

  // TRUST BUILDERS
  const trustSecs = document.querySelectorAll('.trust-card');
  if (trustSecs.length) {
    const trustSection = trustSecs[0].closest('section');
    if (trustSection) {
      const ey = trustSection.querySelector('.eyebrow'), ti = trustSection.querySelector('.section-title'), su = trustSection.querySelector('.section-subtitle');
      if (ey && t['trust.eyebrow']) ey.textContent = t['trust.eyebrow'];
      if (ti && t['trust.title']) ti.textContent = t['trust.title'];
      if (su && t['trust.subtitle']) su.textContent = t['trust.subtitle'];
    }
    const trustData2 = [['trust.c1.title','trust.c1.desc'],['trust.c2.title','trust.c2.desc'],['trust.c3.title','trust.c3.desc'],['trust.c4.title','trust.c4.desc'],['trust.c5.title','trust.c5.desc'],['trust.c6.title','trust.c6.desc']];
    trustSecs.forEach((card, i) => {
      if (!trustData2[i]) return;
      const h = card.querySelector('h3'), p = card.querySelector('p');
      if (h && t[trustData2[i][0]]) h.textContent = t[trustData2[i][0]];
      if (p && t[trustData2[i][1]]) p.textContent = t[trustData2[i][1]];
    });
  }

  // TESTIMONIALS
  setText('#testimonials .eyebrow', 'testi.eyebrow');
  setText('#testimonials .section-title', 'testi.title');
  setText('#testimonials .section-subtitle', 'testi.subtitle');
  const testiCards = document.querySelectorAll('.testimonial-card');
  const testiData = [['testi.t1.text','testi.t1.name','testi.t1.loc'],['testi.t2.text','testi.t2.name','testi.t2.loc'],['testi.t3.text','testi.t3.name','testi.t3.loc']];
  testiCards.forEach((card, i) => {
    if (!testiData[i]) return;
    const tx = card.querySelector('.testimonial-text'), nm = card.querySelector('.author-name'), lc = card.querySelector('.author-location');
    if (tx && t[testiData[i][0]]) tx.textContent = '"' + t[testiData[i][0]] + '"';
    if (nm && t[testiData[i][1]]) nm.textContent = t[testiData[i][1]];
    if (lc && t[testiData[i][2]]) lc.textContent = t[testiData[i][2]];
  });

  // TEAM
  setText('#team .eyebrow', 'team.eyebrow');
  setText('#team .section-title', 'team.title');
  setText('#team .section-subtitle', 'team.subtitle');
  const teamCards = document.querySelectorAll('.team-card');
  const teamData = [['team.m1.name','team.m1.role'],['team.m2.name','team.m2.role'],['team.m3.name','team.m3.role']];
  teamCards.forEach((card, i) => {
    if (!teamData[i]) return;
    const nm = card.querySelector('.team-name'), rl = card.querySelector('.team-title');
    if (nm && t[teamData[i][0]]) nm.textContent = t[teamData[i][0]];
    if (rl && t[teamData[i][1]]) rl.textContent = t[teamData[i][1]];
    const btns = card.querySelectorAll('.team-btn');
    if (btns[0] && t['team.btn.call']) btns[0].innerHTML = '📞 ' + t['team.btn.call'];
    if (btns[1] && t['team.btn.wa']) btns[1].innerHTML = '💬 ' + t['team.btn.wa'];
  });

  // BRANCHES
  setText('#branches .eyebrow', 'branches.eyebrow');
  setText('#branches .section-title', 'branches.title');
  setText('#branches .section-subtitle', 'branches.subtitle');
  document.querySelectorAll('.branch-tag.ho').forEach(el => { if (t['branches.ho.tag']) el.textContent = t['branches.ho.tag']; });
  document.querySelectorAll('.branch-tag.branch').forEach(el => { if (t['branches.br.tag']) el.textContent = t['branches.br.tag']; });
  document.querySelectorAll('.branch-btn-call').forEach(el => { if (t['branches.btn.call']) el.innerHTML = '📞 ' + t['branches.btn.call']; });
  document.querySelectorAll('.branch-btn-wa').forEach(el => { if (t['branches.btn.wa']) el.innerHTML = '💬 ' + t['branches.btn.wa']; });
  document.querySelectorAll('.branch-btn-maps').forEach(el => { if (t['branches.btn.maps']) el.innerHTML = '🗺️ ' + t['branches.btn.maps']; });

  // FAQ
  setText('#faq .eyebrow', 'faq.eyebrow');
  setText('#faq .section-title', 'faq.title');
  setText('#faq .section-subtitle', 'faq.subtitle');
  const faqBtn = document.querySelector('#faq .btn');
  if (faqBtn && t['faq.btn']) faqBtn.textContent = t['faq.btn'];
  const faqItems = document.querySelectorAll('.faq-item');
  const faqData = [
    ['faq.q1','faq.a1'],['faq.q2','faq.a2'],['faq.q3','faq.a3'],['faq.q4','faq.a4'],
    ['faq.q5','faq.a5'],['faq.q6','faq.a6'],['faq.q7','faq.a7'],['faq.q8','faq.a8'],
  ];
  faqItems.forEach((item, i) => {
    if (!faqData[i]) return;
    const q = item.querySelector('.faq-question'), a = item.querySelector('.faq-answer');
    if (q && t[faqData[i][0]]) {
      const arrow = q.querySelector('.faq-arrow');
      q.textContent = t[faqData[i][0]];
      if (arrow) q.appendChild(arrow);
    }
    if (a && t[faqData[i][1]]) a.textContent = t[faqData[i][1]];
  });

  // CONTACT
  setText('#contact .eyebrow', 'contact.eyebrow');
  setText('#contact .section-title', 'contact.title');
  setText('#contact .section-subtitle', 'contact.subtitle');
  const contactLabels = document.querySelectorAll('.contact-card-label');
  const contactLabelKeys = ['contact.phone.label','contact.wa.label','contact.email.label','contact.web.label','contact.ho.label','contact.hangal.label','contact.social.label'];
  contactLabels.forEach((el, i) => { if (contactLabelKeys[i] && t[contactLabelKeys[i]]) el.textContent = t[contactLabelKeys[i]]; });
  const hoAddr = document.querySelector('#contact .contact-card:nth-child(5) .contact-card-value');
  if (hoAddr && t['contact.ho.addr']) hoAddr.innerHTML = t['contact.ho.addr'];
  const hangalAddr = document.querySelector('#contact .contact-card:nth-child(6) .contact-card-value');
  if (hangalAddr && t['contact.hangal.addr']) hangalAddr.innerHTML = t['contact.hangal.addr'];
  const socialLabel = document.querySelector('#contact .contact-card:last-child .contact-card-label');
  if (socialLabel && t['contact.social.label']) socialLabel.textContent = t['contact.social.label'];
  setText('.inquiry-form h3', 'contact.form.title');
  const formLabels = document.querySelectorAll('.form-label');
  const formLabelKeys = ['contact.form.name','contact.form.phone','contact.form.email','contact.form.pkg','contact.form.msg'];
  formLabels.forEach((el, i) => { if (formLabelKeys[i] && t[formLabelKeys[i]]) el.textContent = t[formLabelKeys[i]]; });
  const nameInput = document.getElementById('inq-name');
  const phoneInput = document.getElementById('inq-phone');
  const emailInput = document.getElementById('inq-email');
  const pkgSel = document.getElementById('inq-package');
  const msgTA = document.getElementById('inq-message');
  if (nameInput && t['contact.form.name.ph']) nameInput.placeholder = t['contact.form.name.ph'];
  if (phoneInput && t['contact.form.phone.ph']) phoneInput.placeholder = t['contact.form.phone.ph'];
  if (emailInput && t['contact.form.email.ph']) emailInput.placeholder = t['contact.form.email.ph'];
  if (msgTA && t['contact.form.msg.ph']) msgTA.placeholder = t['contact.form.msg.ph'];
  if (pkgSel && pkgSel.options[0] && t['contact.form.pkg.default']) pkgSel.options[0].textContent = t['contact.form.pkg.default'];
  const submitBtn = document.querySelector('#inquiryForm button[type=submit]');
  if (submitBtn && t['contact.form.submit']) submitBtn.textContent = '📨 ' + t['contact.form.submit'];
  const waSendBtn = document.getElementById('waSendBtn');
  if (waSendBtn && t['contact.form.wa']) waSendBtn.textContent = '💬 ' + t['contact.form.wa'];
  const emailSendBtn = document.getElementById('emailSendBtn');
  if (emailSendBtn && t['contact.form.email.btn']) emailSendBtn.textContent = '📧 ' + t['contact.form.email.btn'];

  // FOOTER
  const footerTagline = document.querySelector('.footer-tagline');
  if (footerTagline && t['footer.tagline']) footerTagline.textContent = t['footer.tagline'];
  const footerCols = document.querySelectorAll('.footer-col h4');
  if (footerCols[0] && t['footer.quick']) footerCols[0].textContent = t['footer.quick'];
  if (footerCols[1] && t['footer.packages']) footerCols[1].textContent = t['footer.packages'];
  if (footerCols[2] && t['footer.contact.col']) footerCols[2].textContent = t['footer.contact.col'];
  const footerCopy = document.querySelector('.footer-bottom p');
  if (footerCopy && t['footer.copy']) footerCopy.textContent = t['footer.copy'];
  const policyLinks = document.querySelectorAll('.footer-bottom a');
  const policyKeys = ['footer.privacy','footer.terms','footer.refund'];
  policyLinks.forEach((a, i) => { if (policyKeys[i] && t[policyKeys[i]]) a.textContent = t[policyKeys[i]]; });
}

// --- DYNAMIC CARD RENDERING CORE ---
function renderPackageCards(t) {
  const container = document.getElementById('packagesGrid');
  if (!container) return;
  container.innerHTML = '';

  // 1. Hajj 2027 Card (Featured)
  const hajjPkg = PACKAGE_CONFIG.packages.find(p => p.id === 'hajj-2027');
  if (hajjPkg && hajjPkg.status !== 'hidden') {
    renderSingleCard(hajjPkg, t, container, true);
  }

  // 2. Group Umrah Combined Card (Featured)
  renderGroupUmrahCard(t, container);

  // 3. Couple Umrah Card
  const couplePkg = PACKAGE_CONFIG.packages.find(p => p.id === 'couple');
  if (couplePkg && couplePkg.status !== 'hidden') {
    renderSingleCard(couplePkg, t, container, false);
  }

  // 4. Family Umrah Card
  const familyPkg = PACKAGE_CONFIG.packages.find(p => p.id === 'family');
  if (familyPkg && familyPkg.status !== 'hidden') {
    renderSingleCard(familyPkg, t, container, false);
  }

  // 5. Ziyarat Package Card
  const ziyaratPkg = PACKAGE_CONFIG.packages.find(p => p.id === 'ziyarat');
  if (ziyaratPkg && ziyaratPkg.status !== 'hidden') {
    renderSingleCard(ziyaratPkg, t, container, false);
  }

  // Bind tabs event logic after rendering cards
  bindGroupTabs();
}

function renderSingleCard(pkg, t, container, isFeatured) {
  const card = document.createElement('div');
  card.className = `package-card ${isFeatured ? 'featured' : ''} reveal`;
  
  if (pkg.badge) {
    const badge = document.createElement('span');
    badge.className = 'package-badge';
    badge.textContent = pkg.badge;
    card.appendChild(badge);
  }
  
  const name = t[pkg.nameKey] || pkg.id;
  const type = t[pkg.typeKey] || 'Package';
  const startPrice = pkg.variants[0].price;
  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(startPrice);
  
  let featuresHtml = '';
  const cleanId = pkg.id.replace('-2027', '');
  const fCount = pkg.id === 'family' || pkg.id === 'hajj-2027' ? 7 : 6;
  for (let i = 1; i <= fCount; i++) {
    const key = `pkg.${cleanId}.f${i}`;
    if (t[key]) {
      featuresHtml += `<li>${t[key]}</li>`;
    }
  }

  const statusBadgeHtml = pkg.status !== 'active' ? `<span class="package-status-badge ${pkg.status}">${pkg.status.replace('_',' ')}</span>` : '';
  const waLink = `https://wa.me/919986925592?text=${encodeURIComponent(`Assalamu Alaikum. I am interested in Noor-E-Haram ${pkg.waQuery}. Please share details.`)}`;

  card.innerHTML += `
    <div class="package-header">
      <div class="package-type">${type}</div>
      <div class="package-name">${name}</div>
    </div>
    <div class="package-body">
      ${statusBadgeHtml}
      <div class="package-price">
        <span class="price-from">${t['pkg.priceFrom'] || 'Starting'}</span>
        <span class="price-amount">${formattedPrice}</span>
      </div>
      <ul class="package-features">
        ${featuresHtml}
      </ul>
      <a href="${waLink}" class="btn btn-primary btn-full-center" target="_blank" rel="noopener noreferrer">${t['pkg.inquireBtn'] || 'Inquire on WhatsApp'}</a>
    </div>
  `;
  container.appendChild(card);
}

function renderGroupUmrahCard(t, container) {
  const card = document.createElement('div');
  card.className = 'package-card featured reveal';
  
  const mumbaiGroup = PACKAGE_CONFIG.packages.find(p => p.id === 'group-mumbai');
  const hubliGroup = PACKAGE_CONFIG.packages.find(p => p.id === 'group-hubli');

  if (!mumbaiGroup || !hubliGroup) return;

  const type = t[mumbaiGroup.typeKey] || 'Group Package';
  const name = t[mumbaiGroup.nameKey] || 'Group Umrah';
  const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  let featuresHtml = '';
  for (let i = 1; i <= 6; i++) {
    const key = `pkg.group.f${i}`;
    if (t[key]) {
      featuresHtml += `<li>${t[key]}</li>`;
    }
  }

  card.innerHTML = `
    <div class="package-header">
      <div class="package-type">${type}</div>
      <div class="package-name">${name}</div>
    </div>
    <div class="package-body">
      <div class="package-tabs">
        <button class="package-tab-btn active" data-tab="mumbai">Mumbai Departure</button>
        <button class="package-tab-btn" data-tab="hubli">Hubli Departure</button>
      </div>

      <!-- Mumbai Tab Content -->
      <div class="package-tab-content active" id="tab-mumbai">
        <div style="font-size:13px; color:var(--text-mid); margin-bottom:12px; line-height: 1.5;">
          <strong>Travel Dates:</strong> 1 December – 6 December<br>
          <strong>Duration:</strong> 6 Days
        </div>
        <table class="package-pricing-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${mumbaiGroup.variants.map(v => `
              <tr>
                <td>${v.name}</td>
                <td>${formatter.format(v.price)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <a href="https://wa.me/919986925592?text=${encodeURIComponent(`Assalamu Alaikum. I am interested in Noor-E-Haram Group Umrah (Mumbai Departure) Package. Please share details.`)}" class="btn btn-primary btn-full-center" target="_blank" rel="noopener noreferrer">${t['pkg.inquireBtn'] || 'Inquire on WhatsApp'}</a>
      </div>

      <!-- Hubli Tab Content -->
      <div class="package-tab-content" id="tab-hubli">
        <div style="font-size:13px; color:var(--text-mid); margin-bottom:12px; line-height: 1.5;">
          <strong>Travel Dates:</strong> Seasonal / Flexible<br>
          <strong>Duration:</strong> Flexible
        </div>
        <table class="package-pricing-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${hubliGroup.variants.map(v => `
              <tr>
                <td>${v.name}</td>
                <td>${formatter.format(v.price)}${v.isStartingLabel ? ' onwards' : ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <a href="https://wa.me/919986925592?text=${encodeURIComponent(`Assalamu Alaikum. I am interested in Noor-E-Haram Group Umrah (Hubli Departure) Package. Please share details.`)}" class="btn btn-primary btn-full-center" target="_blank" rel="noopener noreferrer">${t['pkg.inquireBtn'] || 'Inquire on WhatsApp'}</a>
      </div>

      <div style="margin-top: 16px;">
        <ul class="package-features">
          ${featuresHtml}
        </ul>
      </div>
    </div>
  `;
  container.appendChild(card);
}

function bindGroupTabs() {
  document.querySelectorAll('.package-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.package-body');
      parent.querySelectorAll('.package-tab-btn').forEach(b => b.classList.remove('active'));
      parent.querySelectorAll('.package-tab-content').forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      const tabId = btn.dataset.tab;
      const content = parent.querySelector(`#tab-${tabId}`);
      if (content) content.classList.add('active');
    });
  });
}

// --- DYNAMIC SCHEMA GENERATOR ---
function updateSchema(t) {
  const travelAgency = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "NOOR-E-HARAM",
    "alternateName": "نور حرم",
    "image": "https://www.nooreharam.com/og-image.jpg",
    "url": "https://www.nooreharam.com",
    "telephone": "+91-9986925592",
    "email": "nooreharamindia@gmail.com",
    "priceRange": "₹48,000 - ₹6,99,786",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Behind Barnabas Hall, Mantoor Road",
      "addressLocality": "Hubli",
      "addressRegion": "Karnataka",
      "postalCode": "580020",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 15.3524,
      "longitude": 75.1479
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "09:00",
      "closes": "21:00"
    },
    "sameAs": [
      "https://www.instagram.com/nooreharamindia",
      "https://www.facebook.com/share/1E5LeFEY8f/"
    ],
    "areaServed": ["Karnataka","Kerala","India"],
    "makesOffer": [],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    }
  };

  // Hydrate offers from config dynamically (CTO Recommendation 4)
  PACKAGE_CONFIG.packages.forEach(pkg => {
    const pkgName = t[pkg.nameKey] || pkg.id;
    if (pkg.variants) {
      pkg.variants.forEach(v => {
        travelAgency.makesOffer.push({
          "@type": "Offer",
          "name": `${pkgName} (${v.name} Variant)`,
          "price": v.price.toString(),
          "priceCurrency": "INR"
        });
      });
    } else if (pkg.departures) {
      pkg.departures.forEach(dep => {
        dep.variants.forEach(v => {
          travelAgency.makesOffer.push({
            "@type": "Offer",
            "name": `${pkgName} (${dep.city} - ${v.name} Variant)`,
            "price": v.price.toString(),
            "priceCurrency": "INR"
          });
        });
      });
    }
  });

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.nooreharam.com" },
      { "@type": "ListItem", "position": 2, "name": "Packages", "item": "https://www.nooreharam.com/#packages" },
      { "@type": "ListItem", "position": 3, "name": "Branches", "item": "https://www.nooreharam.com/#branches" }
    ]
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": []
  };
  
  for (let i = 1; i <= 8; i++) {
    const q = t[`faq.q${i}`];
    const a = t[`faq.a${i}`];
    if (q && a) {
      faq.mainEntity.push({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": a
        }
      });
    }
  }

  // Inject or update schema script in head
  let scriptEl = document.getElementById('nh-jsonld-schema');
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.type = 'application/ld+json';
    scriptEl.id = 'nh-jsonld-schema';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify([travelAgency, breadcrumbs, faq], null, 2);
}

export { setLang, applyAllTranslations, currentLang };
