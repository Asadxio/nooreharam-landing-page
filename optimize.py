import re
import os

input_file = r'c:\Users\xioas\OneDrive\Desktop\LANDING PAGE NOOEHARAM\index (1).html'
output_file = r'c:\Users\xioas\OneDrive\Desktop\LANDING PAGE NOOEHARAM\index.html'

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Meta Description
content = re.sub(
    r'<meta name="description" content="[^"]*">',
    '<meta name="description" content="NOOR-E-HARAM – Trusted Islamic travel agency in Hubli, Karnataka. Expert Hajj, Umrah & Ziyarat packages with transparent pricing and dedicated support.">',
    content
)

# 2. Add Missing Meta Tags
new_meta = """<meta name="author" content="NOOR-E-HARAM">
<meta name="geo.region" content="IN-KA">
<meta name="geo.placename" content="Hubli, Karnataka">
<meta name="color-scheme" content="light dark">
<meta name="referrer" content="strict-origin-when-cross-origin">"""

last_meta_idx = content.rfind('<meta')
end_of_last_meta = content.find('>', last_meta_idx) + 1
content = content[:end_of_last_meta] + '\n  ' + new_meta + content[end_of_last_meta:]

# 3. Replace Favicon
content = re.sub(
    r'<link rel="icon" type="image/png" sizes="32x32" href="data:image/png;base64,[^"]*">',
    '<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">',
    content
)
content = re.sub(
    r'<link rel="apple-touch-icon" sizes="180x180" href="data:image/png;base64,[^"]*">',
    '<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">',
    content
)

# 4. Skip link
content = content.replace('<body>', '<body>\n  <a href="#main-content" class="skip-link">Skip to main content</a>')

# 5. Main tag
content = re.sub(r'<main[^>]*>', '<main id="main-content" role="main" tabindex="-1">', content)

# 6. Header/nav ARIA
content = content.replace('<nav class="desktop-nav">', '<nav class="desktop-nav" aria-label="Main navigation">')
content = content.replace('<nav class="drawer-nav">', '<nav class="drawer-nav" aria-label="Mobile navigation">')
content = content.replace('<button class="nav-toggle" id="navToggle">', '<button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="mobileDrawer" aria-label="Open navigation menu">')
content = content.replace('<button class="drawer-close">', '<button class="drawer-close" id="drawerCloseBtn">')
content = content.replace('<button class="drawer-close" onclick="closeDrawer()">', '<button class="drawer-close" id="drawerCloseBtn" onclick="closeDrawer()">')
if 'id="drawerCloseBtn"' not in content:
    content = re.sub(r'<button class="drawer-close"([^>]*)>', r'<button class="drawer-close" id="drawerCloseBtn"\1>', content)

# 7. FAQ ARIA
faq_btns = re.finditer(r'<button class="faq-question"([^>]*)>', content)
offset = 0
faq_count = 1
new_content = ""
last_end = 0
for match in faq_btns:
    start, end = match.span()
    new_content += content[last_end:start]
    btn_attrs = match.group(1)
    new_content += f'<button class="faq-question" aria-expanded="false" id="faq-btn-{faq_count}"{btn_attrs}>'
    last_end = end
    faq_count += 1
new_content += content[last_end:]
content = new_content

faq_count = 1
new_content = ""
last_end = 0
faq_answers = re.finditer(r'<div class="faq-answer"([^>]*)>', content)
for match in faq_answers:
    start, end = match.span()
    new_content += content[last_end:start]
    attrs = match.group(1)
    new_content += f'<div class="faq-answer" id="faq-panel-{faq_count}" aria-labelledby="faq-btn-{faq_count}" role="region"{attrs}>'
    last_end = end
    faq_count += 1
new_content += content[last_end:]
content = new_content

# 8. Form ARIA
content = content.replace('<label>Full Name</label>', '<label for="inq-name">Full Name</label>')
content = content.replace('<label>Mobile Number</label>', '<label for="inq-phone">Mobile Number</label>')
content = content.replace('<label>Email Address</label>', '<label for="inq-email">Email Address</label>')
content = content.replace('<label>Package of Interest</label>', '<label for="inq-package">Package of Interest</label>')
content = content.replace('<label>Message</label>', '<label for="inq-message">Message</label>')
content = content.replace('required', 'required aria-required="true"')
content = content.replace('required aria-required="true" aria-required="true"', 'required aria-required="true"')
content = content.replace('id="formStatus"', 'id="formStatus" role="alert" aria-live="polite"')

# 9. CSS additions
css_additions = """
/* ============================================
   SKIP LINK (ACCESSIBILITY)
   ============================================ */
.skip-link {
  position: absolute;
  top: -100%;
  left: 16px;
  background: var(--emerald);
  color: white;
  padding: 8px 16px;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  z-index: 10000;
  transition: top 0.2s;
}
.skip-link:focus {
  top: 0;
}

/* ============================================
   FOCUS INDICATORS (ACCESSIBILITY)
   ============================================ */
:focus-visible {
  outline: 2px solid var(--emerald);
  outline-offset: 3px;
  border-radius: 2px;
}
.header.hero-mode :focus-visible {
  outline-color: var(--gold-light);
}

/* ============================================
   UTILITY CLASSES (replacing inline styles)
   ============================================ */
.text-gold { color: var(--gold) !important; }
.text-gold-light { color: var(--gold-light) !important; }
.text-emerald { color: var(--emerald) !important; }
.text-white { color: white !important; }
.text-mid { color: var(--text-mid) !important; }
.bg-cream { background: var(--cream) !important; }
.bg-transparent-border { background: transparent; border: 1px solid var(--border); }
.mt-8 { margin-top: 8px !important; }
.mt-16 { margin-top: 16px !important; }
.mt-20 { margin-top: 20px !important; }
.mt-24 { margin-top: 24px !important; }
.mt-32 { margin-top: 32px !important; }
.mt-40 { margin-top: 40px !important; }
.mb-8 { margin-bottom: 8px !important; }
.mb-16 { margin-bottom: 16px !important; }
.mb-24 { margin-bottom: 24px !important; }
.mb-48 { margin-bottom: 48px !important; }
.fw-600 { font-weight: 600 !important; }
.fs-28 { font-size: 28px !important; }
.fs-14 { font-size: 14px !important; }
.fs-18 { font-size: 18px !important; }
.fs-32 { font-size: 32px !important; }
.u-hidden { display: none !important; }
.u-flex { display: flex !important; }
.u-flex-col { flex-direction: column !important; }
.u-gap-12 { gap: 12px !important; }
.u-gap-10 { gap: 10px !important; }
.u-wrap { flex-wrap: wrap !important; }
.u-center-flex { justify-content: center !important; }
.u-max-760 { max-width: 760px !important; }
.u-full-width { width: 100% !important; }
.u-line-h-160 { line-height: 1.6 !important; }
.u-min-w-140 { min-width: 140px !important; }
.u-flex-1 { flex: 1 !important; }
.border-top-border { border-top: 1px solid var(--border) !important; }
.p-section-sm { padding: 56px 0 !important; }
.section-title-sm { font-size: 28px !important; }
.eyebrow-gold { color: var(--gold-light) !important; }
.section-title-white { color: white !important; }
.subtitle-dark { color: rgba(255,255,255,0.55) !important; }
.btn-full-center { width: 100%; justify-content: center; }
.lbl-style { display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 6px; color: var(--text-mid); }
.wizard-heading { color: var(--emerald); font-family: 'Cormorant Garamond', serif; font-size: 28px; margin-bottom: 8px; }
.wizard-subtitle-txt { font-size: 14px; color: var(--text-mid); }
.wizard-result-title { color: var(--emerald); margin-bottom: 16px; font-size: 18px; border-bottom: 1.5px solid var(--border); padding-bottom: 8px; }
.wiz-icon-lg { font-size: 32px; margin-bottom: 8px; }
.form-status-box { display: none; margin-bottom: 16px; padding: 12px 16px; border-radius: 8px; font-size: 14px; }
.tour-card-dubai { background: linear-gradient(135deg, #0d2137 0%, #1a4a6b 100%); }
.tour-card-turkey { background: linear-gradient(135deg, #1a0a0a 0%, #6b1a1a 100%); }
.tour-card-europe { background: linear-gradient(135deg, #0a1a3a 0%, #1a3a6b 100%); }
.tour-card-heritage { background: linear-gradient(135deg, #0a2a1a 0%, #1a5a3a 100%); }
.social-links-row { display: flex; gap: 12px; margin-top: 6px; }
.social-link-inline { color: var(--emerald); text-decoration: none; font-weight: 500; font-size: 14px; }
.branch-label-style { display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 6px; color: var(--text-mid); }
.wiz-prev-hidden { display: none; }
.contact-addr-style { font-size: 13px; line-height: 1.6; }

/* ============================================
   REDUCED MOTION (ACCESSIBILITY)
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .reveal {
    opacity: 1 !important;
    transform: none !important;
  }
  #pageLoader .loader-bar-fill {
    animation: none !important;
    width: 100% !important;
  }
}

/* ============================================
   PRINT STYLES
   ============================================ */
@media print {
  .header, .mobile-bar, .float-whatsapp, #pageLoader,
  .mobile-drawer, .drawer-overlay, .nav-toggle { display: none !important; }
  .hero { min-height: auto; }
  body { font-size: 12px; }
  a { text-decoration: underline; }
}
"""
content = content.replace('</style>', f'{css_additions}\n</style>')

# 10. Replace inline styles
replacements = [
    (r'style="text-align:center; margin-top: 40px;"', r'class="text-center mt-40"'),
    (r'style="margin-bottom: 48px;"', r'class="mb-48"'),
    (r'style="color: var\(--gold-light\);"', r'class="eyebrow-gold"'),
    (r'style="color: white;"', r'class="section-title-white"'),
    (r'style="color: rgba\(255,255,255,0\.55\);"', r'class="subtitle-dark"'),
    (r'style="width:100%; justify-content:center;"', r'class="btn-full-center"'),
    (r'style="text-align:center; margin-top: 32px;"', r'class="text-center mt-32"'),
    (r'style="margin-top: 20px;"', r'class="mt-20"'),
    (r'style="text-align: center; margin-bottom: 24px;"', r'class="text-center mb-24"'),
    (r'style="color: var\(--emerald\); font-family: \'Cormorant Garamond\', serif; font-size: 28px; margin-bottom: 8px;"', r'class="wizard-heading"'),
    (r'style="font-size: 14px; color: var\(--text-mid\);"', r'class="wizard-subtitle-txt"'),
    (r'style="display: none;"', r'class="u-hidden"'),
    (r'style="font-size: 32px; margin-bottom: 8px;"', r'class="wiz-icon-lg"'),
    (r'style="color: var\(--emerald\); margin-bottom: 16px; font-size: 18px; border-bottom: 1.5px solid var\(--border\); padding-bottom: 8px;"', r'class="wizard-result-title"'),
    (r'style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 24px;"', r'class="u-flex u-wrap u-center-flex mt-24"'),
    (r'style="display: none; margin-bottom:16px; padding:12px 16px; border-radius:8px; font-size:14px;"', r'class="form-status-box"'),
    (r'style="display: flex; gap: 10px; flex-wrap: wrap;"', r'class="u-flex u-gap-10 u-wrap"'),
    (r'style="flex:1; justify-content:center; min-width:140px;"', r'class="u-flex-1 u-center-flex u-min-w-140"'),
    (r'style="color:var\(--emerald\); border:1\.5px solid var\(--emerald\);"', r'class="text-emerald bg-transparent-border"'),
    (r'style="padding: 56px 0; border-top: 1px solid var\(--border\);"', r'class="p-section-sm border-top-border"'),
    (r'style="max-width: 760px;"', r'class="u-max-760"'),
    (r'style="font-size: 28px;"', r'class="section-title-sm"'),
    (r'style="font-size:14px; color:var\(--text-mid\); margin-bottom:16px;"', r'class="fs-14 text-mid mb-16"'),
    (r'style="font-size:14px; color:var\(--text-mid\);"', r'class="fs-14 text-mid"'),
    (r'style="background: var\(--cream\);"', r'class="bg-cream"'),
    (r'style="padding: 56px 0; border-top: 1px solid var\(--border\); background: var\(--cream\);"', r'class="p-section-sm border-top-border bg-cream"'),
    (r'style="display:block; font-size:12px; font-weight:600; text-transform:uppercase; margin-bottom:6px; color:var\(--text-mid\);"', r'class="branch-label-style"'),
    (r'style="display:flex; gap: 12px; margin-top: 6px;"', r'class="social-links-row"'),
    (r'style="color: var\(--emerald\); text-decoration:none; font-weight: 500; font-size: 14px;"', r'class="social-link-inline"'),
    (r'style="font-size:13px; line-height:1\.6;"', r'class="contact-addr-style"'),
    (r'style="background: linear-gradient\(135deg, #0d2137 0%, #1a4a6b 100%\);"', r'class="tour-card-dubai"'),
    (r'style="background: linear-gradient\(135deg, #1a0a0a 0%, #6b1a1a 100%\);"', r'class="tour-card-turkey"'),
    (r'style="background: linear-gradient\(135deg, #0a1a3a 0%, #1a3a6b 100%\);"', r'class="tour-card-europe"'),
    (r'style="background: linear-gradient\(135deg, #0a2a1a 0%, #1a5a3a 100%\);"', r'class="tour-card-heritage"'),
    (r'style="display:block; font-size:12px; font-weight:600; text-transform:uppercase; margin-bottom:6px; color:var\(--text-mid\);"', r'class="lbl-style"')
]

for old_style, new_class in replacements:
    new_class_val = new_class.replace('class="', '').replace('"', '')
    pattern_class_before = re.compile(rf'class="([^"]*)"([^>]*) {old_style}')
    content = pattern_class_before.sub(rf'class="\1 {new_class_val}"\2', content)
    pattern_class_after = re.compile(rf'{old_style}([^>]*) class="([^"]*)"')
    content = pattern_class_after.sub(rf'\1 class="\2 {new_class_val}"', content)
    content = re.sub(old_style, new_class, content)

# 11. JS improvements
content = re.sub(
    r"window\.addEventListener\('scroll', \(\) => {([\s\S]*?)\}\);",
    r"window.addEventListener('scroll', () => {\1}, { passive: true });",
    content,
    count=1
)

closeDrawer_orig = """function closeDrawer() {
      document.getElementById('mobileDrawer').classList.remove('open');
      document.getElementById('drawerOverlay').classList.remove('open');
    }"""
closeDrawer_new = """function closeDrawer() {
      document.getElementById('mobileDrawer').classList.remove('open');
      document.getElementById('drawerOverlay').classList.remove('open');
      const navToggle = document.getElementById('navToggle');
      if (navToggle) { navToggle.setAttribute('aria-expanded', 'false'); navToggle.focus(); }
    }"""
content = content.replace(closeDrawer_orig, closeDrawer_new)

navToggle_orig = """document.getElementById('navToggle').addEventListener('click', () => {
      document.getElementById('mobileDrawer').classList.add('open');
      document.getElementById('drawerOverlay').classList.add('open');
    });"""
navToggle_new = """document.getElementById('navToggle').addEventListener('click', () => {
      document.getElementById('mobileDrawer').classList.add('open');
      document.getElementById('drawerOverlay').classList.add('open');
      document.getElementById('navToggle').setAttribute('aria-expanded', 'true');
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeDrawer(); }
    });"""
content = content.replace(navToggle_orig, navToggle_new)

toggleFaq_orig = """function toggleFaq(btn) {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      
      if (!isOpen) {
        item.classList.add('open');
      }
    }"""
toggleFaq_new = """function toggleFaq(btn) {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    }"""
content = content.replace(toggleFaq_orig, toggleFaq_new)

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
