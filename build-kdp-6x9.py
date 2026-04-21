#!/usr/bin/env python3
"""
Build student KDP manuscript (paperback, 6x9) from the latest source textbook.
Output: public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-6x9.html
"""
from pathlib import Path
import re

SRC = Path(__file__).parent / "public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-engineering-cloud-infrastructure-core-student-textbook.html"
DEST = Path(__file__).parent / "public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-6x9.html"


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


def sanitize_student_edition(text: str) -> str:
  # Remove instructor-only frontmatter from the student edition.
  text = re.sub(
    r'\s*<div class="instruction-section">\s*<h2 class="instruction-heading">For Instructors</h2>[\s\S]*?</div>\s*<div class="tip-box">\s*<div class="tip-box-title">\s*📚 Teaching Resources\s*</div>[\s\S]*?</div>',
    '\n',
    text,
    count=1,
  )

  # Student edition keeps questions/prompts but removes answer-bearing sections.
  text = re.sub(
    r'\s*<div class="lab-section">\s*<h2 class="section-heading" id="wk\d+-lab-solutions">[\s\S]*?(?=(?:<!-- WEEKLY QUIZ -->)|(?:<h2 class="section-heading" id="wk\d+-wq")|(?:<h2 class="section-heading" id="wk\d+-wt"))',
    '\n',
    text,
  )
  text = re.sub(
    r'\s*<h2 class="section-heading" id="wk\d+-lab-solutions">[\s\S]*?(?=(?:<h2 class="section-heading" id="wk\d+-wq")|(?:<h2 class="section-heading" id="wk\d+-wt")|(?:<!-- End Week \d+ Chapter -->))',
    '\n',
    text,
  )
  text = re.sub(
    r'\s*<h2 class="section-heading">Lab Solutions &amp; Troubleshooting Guide</h2>[\s\S]*?(?=(?:<!-- End Week \d+ Chapter -->)|(?:<div data-textbook-assessment-course=))',
    '\n',
    text,
  )
  text = re.sub(
    r'\s*<h2 class="section-heading[^>]*">Teacher\'s Solution Guide</h2>\s*<p class="content-text">[\s\S]*?(?=(?:<div class="exercise-box)|(?:<div class="warning-box)|(?:<div class="info-box" style="margin-top: 32px; background: #fefcbf;)|(?:<!-- End Week \d+ Chapter -->))',
    '\n',
    text,
  )

  text = text.replace('Practice Questions &amp; Answers', 'Practice Questions')
  text = text.replace(
    'provided below—attempt each question before reviewing the\n      answer.',
    'for independent practice. Discuss your responses with an\n      instructor, mentor, or study group after attempting them.',
  )
  text = text.replace(
    'auto-grading. Answer key provided below.',
    'auto-grading. Keep your responses separate for instructor or self-review.',
  )

  text = re.sub(r'\s*<div class="answer-text">[\s\S]*?</div>', '\n', text)
  text = re.sub(r'\s*<p class="answer-text">[\s\S]*?</p>', '\n', text)
  text = re.sub(r'\s*<div class="[^\"]*">\s*<strong>Correct Answer:[\s\S]*?</div>', '\n', text)
  text = re.sub(r'\s*<p class="[^\"]*">\s*✓?\s*Correct Answer:[\s\S]*?</p>', '\n', text)
  text = re.sub(r'\s*<strong>Correct Answer:</strong>\s*[^<]*', '', text)
  text = re.sub(r'class="quiz-option correct"', 'class="quiz-option"', text)
  text = re.sub(
    r'\s*<div class="info-box[^\"]*">\s*<div class="info-title">\s*📋 Quiz Answer Key\s*</div>[\s\S]*?</div>',
    '\n',
    text,
  )
  text = re.sub(r'\s*<h3 class="lab-solution-header">[\s\S]*?</div>', '\n', text)

  return text


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
html = sanitize_student_edition(html)

# First page in manuscript should use normal margins (not full-bleed cover margin).
html = rewrite_first_page_margin_rule(html)

# Distinguish manuscript build output title.
html = re.sub(
  r'<title>[\s\S]*?</title>',
  '<title>DevOps Engineering &amp; Cloud Infrastructure - Core Track Textbook (6x9 KDP Student Manuscript)</title>',
  html,
  count=1,
)

DEST.parent.mkdir(parents=True, exist_ok=True)
DEST.write_text(html, encoding="utf-8")

print(f"[ok] Student KDP manuscript built: {DEST}")
print(f"     Source bytes: {SRC.stat().st_size:,} -> Output bytes: {DEST.stat().st_size:,}")
