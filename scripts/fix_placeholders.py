"""
Replace visible [[PLACEHOLDER]] tokens in legal pages with owner-confirmation notices.
Strategy:
  - [[GRIEVANCE_OFFICER]] → styled "To be confirmed by management" notice
  - [[LEGAL_ENTITY_NAME]] → "NOOR-E-HARAM Tours & Travels" (trade name, safe to use)
  - [[PAYMENT_DETAILS - *]] → styled "To be confirmed" notice
  - [[DAYS_WINDOW_*]] / [[DEDUCTION_SLAB_*]] / [[REFUND_ELIGIBILITY_*]] / [[REFUND_PROCESSING_DAYS]] → styled notice

Rule: We DO NOT invent values. We show a clearly marked admin-pending state.
"""
import os, re

ROOT = r"c:\Users\xioas\OneDrive\Desktop\LANDING PAGE NOOEHARAM"

PENDING_STYLE = 'style="background:#fef9c3;color:#78350f;border:1px solid #fcd34d;padding:2px 8px;border-radius:4px;font-size:0.85em;font-weight:600;"'
PENDING_NOTICE = f'<span {PENDING_STYLE}>⏳ To be confirmed by management</span>'

LEGAL_ENTITY_SAFE = "NOOR-E-HARAM Tours &amp; Travels"

def replace_tokens(content):
    # 1. [[LEGAL_ENTITY_NAME]]
    content = re.sub(r'\[\[LEGAL_ENTITY_NAME\]\]', LEGAL_ENTITY_SAFE, content)
    
    # 2. [[GRIEVANCE_OFFICER]] (may appear inline in text)
    content = re.sub(r'\[\[GRIEVANCE_OFFICER\]\]', PENDING_NOTICE, content)
    
    # 3. [[PAYMENT_DETAILS - anything]] 
    content = re.sub(r'\[\[PAYMENT_DETAILS[^\]]*\]\]', PENDING_NOTICE, content)
    
    # 4. Refund slab placeholders
    content = re.sub(r'\[\[DAYS_WINDOW_\d+\]\]', PENDING_NOTICE, content)
    content = re.sub(r'\[\[DEDUCTION_SLAB_\d+\]\]', PENDING_NOTICE, content)
    content = re.sub(r'\[\[REFUND_ELIGIBILITY_\d+\]\]', PENDING_NOTICE, content)
    content = re.sub(r'\[\[REFUND_PROCESSING_DAYS\]\]', PENDING_NOTICE, content)
    
    # 5. Catch-all for any remaining [[...]] - replace with pending notice
    content = re.sub(r'\[\[[^\]]+\]\]', PENDING_NOTICE, content)
    
    return content

LEGAL_PAGES = [
    "privacy-policy/index.html",
    "terms-and-conditions/index.html",
    "payment-policy/index.html",
    "refund-and-cancellation-policy/index.html",
]

for rel in LEGAL_PAGES:
    path = os.path.join(ROOT, rel)
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()
    
    original = content
    new_content = replace_tokens(content)
    
    # Count replacements
    orig_count = len(re.findall(r'\[\[', original))
    new_count = len(re.findall(r'\[\[', new_content))
    
    if new_content != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"✅ {rel}: replaced {orig_count} placeholder(s), {new_count} remaining")
    else:
        print(f"-- {rel}: no changes needed")

print("\nDone.")
