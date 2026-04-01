#!/usr/bin/env python3
"""
Transform devops-kdp-6x9-teacher.html -> devops-kdp-6x9-hardcover-teacher.html
KDP hardcover uses the same 6x9 trim with a larger gutter.
"""
import re
from pathlib import Path

SRC = Path(__file__).parent / "public/textbooks/kdp/devops-kdp-6x9-teacher.html"
DEST = Path(__file__).parent / "public/textbooks/kdp/devops-kdp-6x9-hardcover-teacher.html"

html = SRC.read_text(encoding="utf-8")

html = html.replace(
  "6×9 KDP Teacher Edition",
  "6×9 KDP Teacher Edition Hardcover",
  1,
)

html = re.sub(
  r'(size:\s*6in 9in;\s*\n\s*)margin:\s*0\.625in 0\.5in;',
  r'\g<1>margin: 0.75in 0.5in;',
  html,
  count=1,
)

html = html.replace(
  "@page :left {\n      margin: 0.625in 0.8in 0.625in 0.45in;\n    }",
  "@page :left {\n      margin: 0.75in 0.9in 0.75in 0.5in;\n    }",
)
html = html.replace(
  "@page :right {\n      margin: 0.625in 0.45in 0.625in 0.8in;\n    }",
  "@page :right {\n      margin: 0.75in 0.5in 0.75in 0.9in;\n    }",
)

DEST.parent.mkdir(parents=True, exist_ok=True)
DEST.write_text(html, encoding="utf-8")
print(f"✓ KDP 6×9 teacher hardcover manuscript -> {DEST}")
print(f"  {DEST.stat().st_size:,} bytes")
