#!/usr/bin/env python3
"""
Build KDP paperback (6x9) manuscript for Dunce to Midjourney Pro.

Source:  public/textbooks/dunce-to-midjourney-pro-textbook.html
Output:  public/textbooks/kdp/dunce-to-midjourney-pro/dunce-to-midjourney-pro-kdp-6x9.html

Rules applied:
  1. Strip any placeholder ISBN lines from the interior (Non-Negotiable Rule #2)
  2. Apply gutter-mirrored @page :left / :right rules for paperback binding
  3. Retitle for paperback manuscript mode
"""
from pathlib import Path
import re

ROOT = Path(__file__).parent
TITLE = "Dunce to Midjourney Pro"

SRC = ROOT / "public/textbooks/dunce-to-midjourney-pro-textbook.html"
DEST = ROOT / "public/textbooks/kdp/dunce-to-midjourney-pro/dunce-to-midjourney-pro-kdp-6x9.html"

GUTTER_PB  = "0.75in"   # gutter (spine side) for paperback
OUTSIDE_PB = "0.5in"    # outside margin for paperback


def strip_placeholder_isbn(text: str) -> str:
    return re.sub(
        r'\s*<p>ISBN:[^<]*(?:Placeholder)[^<]*</p>',
        '',
        text,
    )


def inject_mirrored_page_rules(text: str) -> str:
    old_block = re.compile(
        r'/\* 1\. PRINT & PAGE SETTINGS.*?@page \{[^}]*\}',
        re.DOTALL,
    )
    new_block = (
        "/* 1. PRINT & PAGE SETTINGS (6x9 Trade Paperback — Gutter-Mirrored) */\n"
        "        @page {\n"
        "            size: 6in 9in;\n"
        f"            margin: 0.75in 0.5in 0.75in {GUTTER_PB};\n"
        "            @bottom-center {\n"
        '                content: counter(page);\n'
        '                font-family: "Georgia", serif;\n'
        "                font-size: 10pt;\n"
        "            }\n"
        "        }\n"
        "        @page :left {\n"
        "            margin-top: 0.75in;\n"
        "            margin-bottom: 0.75in;\n"
        f"            margin-left: {OUTSIDE_PB};\n"
        f"            margin-right: {GUTTER_PB};\n"
        "        }\n"
        "        @page :right {\n"
        "            margin-top: 0.75in;\n"
        "            margin-bottom: 0.75in;\n"
        f"            margin-left: {GUTTER_PB};\n"
        f"            margin-right: {OUTSIDE_PB};\n"
        "        }"
    )
    result, n = old_block.subn(new_block, text, count=1)
    if n == 0:
        print("  [warn] @page block not matched — skipping margin rewrite")
    return result


def retitle(text: str) -> str:
    return re.sub(
        r'<title>[^<]*</title>',
        f'<title>{TITLE} (6\u00d79 Paperback Manuscript)</title>',
        text,
        count=1,
    )


def build() -> None:
    if not SRC.exists():
        raise FileNotFoundError(f"Source not found: {SRC}")

    html = SRC.read_text(encoding="utf-8")
    html = strip_placeholder_isbn(html)
    html = inject_mirrored_page_rules(html)
    html = retitle(html)

    DEST.parent.mkdir(parents=True, exist_ok=True)
    DEST.write_text(html, encoding="utf-8")

    print(f"[ok] Built {DEST}")
    print(f"     Source: {SRC.stat().st_size:,} bytes -> Output: {DEST.stat().st_size:,} bytes")


if __name__ == "__main__":
    build()
