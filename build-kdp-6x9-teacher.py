#!/usr/bin/env python3
"""
Build teacher KDP manuscript (paperback, 6x9) from the latest source textbook.
Output: public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-6x9-teacher.html
"""
from pathlib import Path
import re

SRC = Path(__file__).parent / "public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-engineering-cloud-infrastructure-core-textbook.html"
DEST = Path(__file__).parent / "public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-6x9-teacher.html"


def strip_section_by_markers(text: str, start_marker: str, end_marker: str) -> str:
  start = text.find(start_marker)
  if start == -1:
    return text
  end = text.find(end_marker, start)
  if end == -1 or end <= start:
    return text
  return text[:start] + text[end:]


def rewrite_first_page_margin_rule(text: str) -> str:
  pattern = (
    r'@page\s*:first\s*\{\s*'
    r'margin:\s*0;\s*'
    r'@bottom-right\s*\{\s*content:\s*none;\s*\}\s*'
    r'\}'
  )
  replacement = (
    '@page :first {\n'
    '        margin-top: var(--book-margin-top-bottom);\n'
    '        margin-bottom: var(--book-margin-top-bottom);\n'
    '        margin-left: var(--book-margin-gutter);\n'
    '        margin-right: var(--book-margin-outside);\n'
    '        @bottom-right {\n'
    '            content: none;\n'
    '        }\n'
    '    }'
  )
  return re.sub(pattern, replacement, text, count=2)


def strip_placeholder_book_ids(text: str) -> str:
  return re.sub(
    r'<p><strong>ISBN:</strong>\s*978-0-000000-00-0\s*\(Placeholder\)\s*<br>\s*<strong>DOI:</strong>\s*10\.0000/hexadigitall\.devops\.core\s*\(Placeholder\)</p>\s*',
    '',
    text,
    count=1,
  )


html = SRC.read_text(encoding="utf-8")

# KDP interior upload should not contain front or back cover pages.
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
html = strip_placeholder_book_ids(html)

# First page in manuscript should use normal margins (not full-bleed cover margin).
html = rewrite_first_page_margin_rule(html)

# Distinguish manuscript build output title.
html = re.sub(
  r'<title>[\s\S]*?</title>',
  '<title>DevOps Engineering &amp; Cloud Infrastructure - Core Track Textbook (6x9 KDP Teacher Manuscript)</title>',
  html,
  count=1,
)

DEST.parent.mkdir(parents=True, exist_ok=True)
DEST.write_text(html, encoding="utf-8")

print(f"[ok] Teacher KDP manuscript built: {DEST}")
print(f"     Source bytes: {SRC.stat().st_size:,} -> Output bytes: {DEST.stat().st_size:,}")
