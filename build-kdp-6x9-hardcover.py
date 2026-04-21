#!/usr/bin/env python3
"""
Build hardcover student manuscript from the paperback manuscript.
Output: public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-6x9-hardcover.html
"""
import re
from pathlib import Path

SRC  = Path(__file__).parent / "public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-6x9.html"
DEST = Path(__file__).parent / "public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-6x9-hardcover.html"

html = SRC.read_text(encoding="utf-8")

html = re.sub(
    r'<p><strong>ISBN:</strong>\s*978-0-000000-00-0\s*\(Placeholder\)\s*<br>\s*<strong>DOI:</strong>\s*10\.0000/hexadigitall\.devops\.core\s*\(Placeholder\)</p>\s*',
    '',
    html,
    count=1,
)

# Increase gutter margin variable for hardcover binding while preserving content system.
html = re.sub(
    r'(--book-margin-gutter:\s*)([0-9]+(?:\.[0-9]+)?)mm;',
    r'\g<1>8.75mm;',
    html,
    count=1,
)

# Set hardcover-specific title.
html = re.sub(
    r'<title>[\s\S]*?</title>',
    '<title>DevOps Engineering &amp; Cloud Infrastructure - Core Track Textbook (6x9 KDP Student Hardcover Manuscript)</title>',
    html,
    count=1,
)

DEST.parent.mkdir(parents=True, exist_ok=True)
DEST.write_text(html, encoding="utf-8")
print(f"[ok] Student KDP hardcover manuscript built: {DEST}")
print(f"  {DEST.stat().st_size:,} bytes")
