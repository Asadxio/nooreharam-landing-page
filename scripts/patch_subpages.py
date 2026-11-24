"""
Batch-patch all subpage HTML files:
1. Replace Google Fonts CDN link -> self-hosted fonts.css
2. Remove fonts.googleapis.com preconnect/dns-prefetch
3. Make components.css + pages.css + utilities.css + responsive.css + animations.css async
4. Keep design-tokens.css + core.css + layout.css synchronous (above-fold critical)
"""
import os, re, glob

ROOT = r"c:\Users\xioas\OneDrive\Desktop\LANDING PAGE NOOEHARAM"

GOOGLE_FONTS_PATTERN = re.compile(
    r'\s*<link[^>]+href=["\']https://fonts\.googleapis\.com/css2[^"\']*["\'][^>]*>\n?',
    re.IGNORECASE
)
PRECONNECT_FONTS_PATTERN = re.compile(
    r'\s*<link[^>]+(?:preconnect|dns-prefetch)[^>]+(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>\n?',
    re.IGNORECASE
)

ASYNC_CSS_NAMES = ["components.css", "pages.css", "utilities.css", "responsive.css", "animations.css", "tools.css"]

def make_async(line):
    """Convert a synchronous stylesheet link to async (media=print onload) pattern."""
    # Already async?
    if 'media="print"' in line or "media='print'" in line:
        return line
    # Extract href
    href_m = re.search(r'href=["\']([^"\']+\.css)["\']', line)
    if not href_m:
        return line
    href = href_m.group(1)
    fname = href.split('/')[-1]
    if fname not in ASYNC_CSS_NAMES:
        return line
    # Build async version
    indent = re.match(r'^(\s*)', line).group(1)
    return (
        f'{indent}<link rel="stylesheet" href="{href}" media="print" onload="this.media=\'all\'"><noscript><link rel="stylesheet" href="{href}"></noscript>\n'
    )

# fonts.css self-hosted link to insert (relative path will be set per-file)
FONTS_SELF_HOSTED_COMMENT = "<!-- Self-hosted fonts: replaces Google Fonts CDN -->"

html_files = glob.glob(os.path.join(ROOT, "**", "index.html"), recursive=True)
# Skip the root index.html — already patched
html_files = [f for f in html_files if os.path.normpath(f) != os.path.normpath(os.path.join(ROOT, "index.html"))]

print(f"Processing {len(html_files)} subpage files...")
changed = 0

for filepath in sorted(html_files):
    rel = os.path.relpath(filepath, ROOT)
    # Compute depth for relative path prefix
    depth = len(rel.split(os.sep)) - 1  # number of directory levels
    prefix = "/".join([".."] * depth)  # e.g. "../.." for 2 levels deep
    if not prefix:
        prefix = "."
    
    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()
    
    original = content
    
    # 1. Remove Google Fonts CDN link
    new_content = GOOGLE_FONTS_PATTERN.sub("", content)
    
    # 2. Remove fonts preconnect/dns-prefetch
    new_content = PRECONNECT_FONTS_PATTERN.sub("", new_content)
    
    # 3. Insert self-hosted fonts.css after <head> or before first stylesheet link
    # Only insert if not already there
    if "fonts.css" not in new_content:
        # Find first <link rel="stylesheet" or <link rel="preconnect"
        insert_m = re.search(r'(<link\s+rel="stylesheet")', new_content, re.IGNORECASE)
        if insert_m:
            pos = insert_m.start()
            indent = "  "
            fonts_line = f'{indent}<!-- Self-hosted fonts: no CDN round-trip, font-display:swap -->\n{indent}<link rel="stylesheet" href="{prefix}/assets/css/fonts.css">\n'
            new_content = new_content[:pos] + fonts_line + new_content[pos:]
        else:
            print(f"  WARN: Could not find insertion point for fonts.css in {rel}")
    
    # 4. Make non-critical CSS async (line by line)
    lines = new_content.split('\n')
    new_lines = []
    for line in lines:
        new_lines.append(make_async(line))
    new_content = '\n'.join(new_lines)
    
    if new_content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"  ✅ Patched: {rel}")
        changed += 1
    else:
        print(f"  -- Unchanged: {rel}")

print(f"\nDone. {changed}/{len(html_files)} files patched.")
