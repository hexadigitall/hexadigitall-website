#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).parent
TITLE = "Architecting Landing Zones: Foundations to Production"

NORMAL_FIRST_PAGE_RULE = (
    "@page :first {\n"
    "            margin-top: var(--book-margin-top-bottom);\n"
    "            margin-bottom: var(--book-margin-top-bottom);\n"
    "            margin-left: var(--book-margin-gutter);\n"
    "            margin-right: var(--book-margin-outside);\n"
    "        }"
)


def strip_cover_page(text: str) -> str:
    start_marker = '<div class="book-page cover-page">'
    next_page_marker = '\n    <div class="book-page">'
    start = text.find(start_marker)
    if start == -1:
        return text
    end = text.find(next_page_marker, start)
    if end == -1:
        return text
    return text[:start] + text[end + 1:]


def rewrite_first_page_margin_rule(text: str) -> str:
    pattern = r'@page\s*:first\s*\{\s*margin:\s*0;\s*\}'
    return re.sub(pattern, NORMAL_FIRST_PAGE_RULE, text, count=1)


def sanitize_student_edition(text: str) -> str:
    text = re.sub(r'\s*<div[^>]*>\s*<strong>Answer:[\s\S]*?</div>', '\n', text)
    return text


def retitle(text: str, edition: str, binding: str) -> str:
    title = f'{TITLE} ({edition} {binding} Manuscript)'
    return re.sub(r'<title>[\s\S]*?</title>', f'<title>{title}</title>', text, count=1)


def bump_hardcover_gutter(text: str) -> str:
    return re.sub(
        r'(--book-margin-gutter:\s*)([0-9]+(?:\.[0-9]+)?)mm;',
        r'\g<1>8.75mm;',
        text,
        count=1,
    )


def build(source: Path, dest: Path, edition: str, binding: str, sanitize_student: bool = False, hardcover: bool = False) -> None:
    html = source.read_text(encoding='utf-8')
    html = strip_cover_page(html)
    html = rewrite_first_page_margin_rule(html)
    if sanitize_student:
        html = sanitize_student_edition(html)
    if hardcover:
        html = bump_hardcover_gutter(html)
    html = retitle(html, edition, binding)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(html, encoding='utf-8')
    print(f'[ok] Built {dest}')
    print(f'     Source bytes: {source.stat().st_size:,} -> Output bytes: {dest.stat().st_size:,}')
