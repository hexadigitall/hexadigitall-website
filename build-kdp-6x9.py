#!/usr/bin/env python3
"""
Transform the DevOps textbook for KDP 6x9 paperback format.
Outputs: public/textbooks/kdp/devops-kdp-6x9.html
"""
import re
from pathlib import Path

SRC  = Path(__file__).parent / "public/textbooks/devops-engineering-cloud-infrastructure-core-textbook.html"
DEST = Path(__file__).parent / "public/textbooks/kdp/devops-kdp-6x9.html"

html = SRC.read_text(encoding="utf-8")


def strip_section_by_markers(text: str, start_marker: str, end_marker: str) -> str:
  start = text.find(start_marker)
  end = text.find(end_marker)
  if start == -1 or end == -1 or end <= start:
    return text
  return text[:start] + text[end:]


# Remove the original front and back covers from the source textbook.
# KDP uploads need the manuscript interior only; covers are generated separately.
html = strip_section_by_markers(
  html,
  "  <!-- ===== COVER PAGE ===== -->",
  "  <!-- ===== COPYRIGHT PAGE ===== -->",
)
html = strip_section_by_markers(
  html,
  "    <!-- ===== BACK COVER PAGE ===== -->",
  "    <script>",
)

# ── 1. Update <title> ───────────────────────────────────────────────────────
html = html.replace(
    "<title>DevOps Engineering &amp; Cloud Infrastructure - Core Track\n  Textbook</title>",
    "<title>DevOps Engineering &amp; Cloud Infrastructure — Core Track Textbook (6×9 KDP)</title>",
    1
)

# ── 2. Add ISBN meta tags after <meta charset> ───────────────────────────────
isbn_meta = (
    '\n  <meta name="book:isbn" content="978-0-000000-00-0">'
    '\n  <meta name="citation_isbn" content="978-0-000000-00-0">'
)
html = html.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">' + isbn_meta, 1)

# ── 3. Replace A4 @page with 6×9 @page (screen/base section) ────────────────
#    Pattern: @page {\n      size: A4;\n      margin: 10mm;
html = re.sub(
    r'(@page\s*\{)\s*\n(\s*)size:\s*A4;\s*\n(\s*)margin:\s*10mm;',
    (r'\1\n\2size: 6in 9in;\n\3margin: 0.625in 0.5in;'
     '\n\n'
     r'    @bottom-center {'
     '\n'
     r'      content: counter(page);'
     '\n'
     r'      font-family: "Inter", sans-serif;'
     '\n'
     r'      font-size: 9pt;'
     '\n'
     r'      color: #666;'
     '\n'
     r'    }'),
    html,
    count=1
)

# ── 4. After the base @page block, inject :left/:right mirrored margins ──────
mirrored = """
    @page :left {
      margin: 0.625in 0.8in 0.625in 0.45in;
    }

    @page :right {
      margin: 0.625in 0.45in 0.625in 0.8in;
    }
"""
# Insert right after the first @page :first block that follows our new @page
html = re.sub(
    r'(@page\s*:first\s*\{[^}]*\})',
    r'\1' + mirrored,
    html,
    count=1
)

# ── 5. Replace A4 inside @media print @page ──────────────────────────────────
# This hits the duplicate @page inside @media print
html = re.sub(
    r'(        @page\s*\{)\s*\n(\s*)size:\s*A4;\s*\n(\s*)margin:\s*10mm;',
    r'\1\n\2size: 6in 9in;\n\3margin: 0.625in 0.5in;',
    html
)

# ── 6. Replace @page cover { size: A4 → 6in 9in ──────────────────────────────
html = re.sub(r'(@page\s+cover\s*\{[^}]*?)size:\s*A4', r'\1size: 6in 9in', html)

# ── 7. Replace @page frontmatter { size: A4 → 6in 9in ────────────────────────
html = re.sub(r'(@page\s+frontmatter\s*\{[^}]*?)size:\s*A4', r'\1size: 6in 9in', html)

# ── 8. Replace @page main-first-page { size: A4 → 6in 9in ───────────────────
html = re.sub(r'(@page\s+main-first-page\s*\{[^}]*?)size:\s*A4', r'\1size: 6in 9in', html)

# ── 9. Cover page dims: 210mm → 6in, 297mm → 9in ────────────────────────────
html = html.replace("width: 210mm;", "width: 6in;")
html = html.replace("height: 297mm;", "height: 9in;")
html = html.replace("width: 210mm !important;", "width: 6in !important;")
html = html.replace("height: 297mm !important;", "height: 9in !important;")
html = html.replace("max-width: calc(100% - 34mm);", "max-width: calc(6in - 1in);")
html = html.replace("width: 160mm;", "width: calc(6in - 1.2in);")

# ── 10. Scale down oversized headings in chapter CSS (not @media print) ──────
#   The chapter padding is huge for a 6×9 page — tighten it
html = re.sub(
    r'(\.chapter\s*\{[^}]*?)padding:\s*80px\s+60px;',
    r'\1padding: 0.4in 0.3in;',
    html
)
html = re.sub(
    r'(\.copyright-page\s*\{[^}]*?)padding:\s*80px\s+60px;',
    r'\1padding: 0.4in 0.3in;',
    html
)
html = re.sub(
    r'(\.frontmatter-page\s*\{[^}]*?)padding:\s*80px\s+60px;',
    r'\1padding: 0.4in 0.3in;',
    html
)
html = re.sub(
    r'(\.toc-page\s*\{[^}]*?)padding:\s*80px\s+60px;',
    r'\1padding: 0.4in 0.3in;',
    html
)
html = re.sub(
    r'(\.methodology-page\s*\{[^}]*?)padding:\s*80px\s+60px;',
    r'\1padding: 0.4in 0.3in;',
    html
)
html = re.sub(
    r'(\.how-to-use-page\s*\{[^}]*?)padding:\s*80px\s+60px;',
    r'\1padding: 0.4in 0.3in;',
    html
)

# ── 11. Inject extra @media print overrides (6x9 specifics) ─────────────────
#    Find the last </style> before </head> and inject before it
PRINT_OVERRIDES = """
    /* ===== KDP 6×9 OVERRIDES ===== */
    @media print {
      body { font-size: 10pt; }

      .chapter-title    { font-size: 22pt !important; }
      .section-heading  { font-size: 16pt !important; margin: 0.35in 0 0.15in !important; }
      .subsection-heading { font-size: 13pt !important; }
      .page-title, .toc-title, .frontmatter-title, .copyright-title { font-size: 18pt !important; }

      .cover-title { font-size: 24pt !important; }
      .cover-subtitle { font-size: 12pt !important; }
      .cover-brand { font-size: 11pt !important; }

      /* Back cover card width fits in 6×9 */
      .back-cover-content {
        width: calc(6in - 1.2in) !important;
        padding: 0.35in 0.28in !important;
      }
      .back-cover-top  { padding: 0.28in 0.35in 0 !important; }
      .back-cover-footer { padding: 0 0.35in 0.28in !important; }
      .back-cover-title { font-size: 18pt !important; }
      .back-cover-blurb { font-size: 11pt !important; }
      .back-cover-list li { font-size: 10pt !important; }
      .back-cover-brand { font-size: 13pt !important; }

      /* Chapter padding */
      .chapter, .frontmatter-page, .copyright-page,
      .toc-page, .methodology-page, .how-to-use-page {
        padding: 0 !important;
        max-width: none !important;
      }

      /* Code slightly smaller on 6×9 */
      .code-block, pre { font-size: 8pt !important; }
      .output-block    { font-size: 8pt !important; }
      .content-text    { font-size: 10pt !important; line-height: 1.65 !important; }

      /* Objectives grid single column on 6×9 */
      .objectives-grid { grid-template-columns: 1fr !important; }
      .methodology-grid { grid-template-columns: 1fr !important; }
      .toolkit-grid    { flex-direction: column !important; }

      /* Rubric table: smaller font */
      .rubric-table th, .rubric-table td { font-size: 8pt !important; padding: 6px !important; }
    }
"""

# Inject before the </style> that closes the main style block
last_style_end = html.rfind("</style>", 0, html.find("</head>"))
if last_style_end != -1:
    html = html[:last_style_end] + PRINT_OVERRIDES + html[last_style_end:]

# ── 12. Inject preliminary pages HTML right after <body> ─────────────────────
PRELIM_HTML = """
  <!-- ====== KDP PRELIMINARY PAGES ====== -->
  <!-- Half-title page -->
  <div class="kdp-prelim-page" style="page: prelude; break-after: page; min-height: 7.75in; padding: 0.4in; display:flex; flex-direction:column; justify-content:center;">
    <p style="font-family:'Space Grotesk',sans-serif; font-size:8pt; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#0d9488; margin:0 0 0.15in;">Hexadigitall Core Track Series</p>
    <div style="width:0.5in; height:2px; background:#2dd4bf; margin-bottom:0.2in;"></div>
    <h1 style="font-family:'Space Grotesk',sans-serif; font-size:22pt; font-weight:700; line-height:1.2; color:#0f172a; margin:0;">DevOps Engineering<br>&amp; Cloud Infrastructure</h1>
    <p style="font-family:'Inter',sans-serif; font-size:11pt; color:#334155; margin-top:0.12in;">Core Track Textbook</p>
  </div>

  <!-- Verso blank -->
  <div class="kdp-prelim-page" style="page: prelude; break-after: page; min-height: 7.75in;"></div>

  <!-- Dedication -->
  <div class="kdp-prelim-page" style="page: prelude; break-after: page; min-height: 7.75in; padding: 0.4in; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
    <div style="width:0.4in; height:1px; background:#2dd4bf; margin-bottom:0.2in;"></div>
    <p style="font-family:'Inter',sans-serif; font-size:11pt; font-style:italic; line-height:1.8; color:#334155; max-width:4.5in;">
      To every engineer who has stared at a failing pipeline at midnight and kept going.<br><br>
      To the learners who push through complexity in pursuit of mastery.
    </p>
    <div style="width:0.4in; height:1px; background:#2dd4bf; margin-top:0.2in;"></div>
  </div>

  <!-- Verso blank -->
  <div class="kdp-prelim-page" style="page: prelude; break-after: page; min-height: 7.75in;"></div>
  <!-- ====== END PRELIMINARY PAGES ====== -->

"""

body_tag_pos = html.find("<body>")
if body_tag_pos == -1:
    body_tag_pos = html.find("<body ")
    body_tag_end = html.find(">", body_tag_pos) + 1
else:
    body_tag_end = body_tag_pos + len("<body>")

html = html[:body_tag_end] + PRELIM_HTML + html[body_tag_end:]

# ── 13. Write output ──────────────────────────────────────────────────────────
DEST.parent.mkdir(parents=True, exist_ok=True)
DEST.write_text(html, encoding="utf-8")

print(f"✓ KDP 6×9 manuscript written → {DEST}")
print(f"  Source: {SRC.stat().st_size:,} bytes → {DEST.stat().st_size:,} bytes")
